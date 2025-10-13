<script lang="ts">
  import type { Todo } from "../types";
  import { onMount } from "svelte";
  import Sortable from "sortablejs";
  import Checkbox from "./Checkbox.svelte";
  import EditableText from "./EditableText.svelte";
  import TrashbinIcon from "./icons/TrashbinIcon.svelte";
  import { getItemFromChromeStorage, saveItemOnChromeStorage } from "../lib/chrome";
  import { NAMESPACE_USER_TODOS } from "../constants";

  let { todos }: { todos: Todo[] } = $props();
  let addInputKey = $state(0);

  let sortable: Sortable | null = null;
  let todoULElement: HTMLUListElement;

  onMount(() => {
    getItemFromChromeStorage(NAMESPACE_USER_TODOS, (value) => {
      const storedTodos = Object.values(value) as Todo[];
      if (Array.isArray(storedTodos)) {
        todos.push(...storedTodos);
      }
    });
  });

  onMount(() => {
    if (!todoULElement) return;
    if (!sortable) {
      sortable = Sortable.create(todoULElement, {
        // animation: 150,
        onEnd: (evt) => {
          if (
            evt.oldIndex !== undefined &&
            evt.newIndex !== undefined &&
            evt.oldIndex !== evt.newIndex
          ) {
            const sortOrder = sortable!.toArray();

            const reorderedTodos: Todo[] = [];
            sortOrder.forEach((todoId) => {
              const todo = todos.find((t) => t.id === todoId);
              if (todo) reorderedTodos.push(todo);
            });

            if (reorderedTodos.length === todos.length) {
              todos.length = 0;
              todos.push(...reorderedTodos);
              persistTodos();

              console.log(todos);
            }
          }
        },
      });
    }

    return () => {
      if (sortable) {
        sortable.destroy();
        sortable = null;
      }
    };
  });

  function persistTodos() {
    saveItemOnChromeStorage(NAMESPACE_USER_TODOS, todos);
  }

  function addTodo(newTodoItem: Todo["item"]) {
    if (!newTodoItem.length) return;

    todos.push({
      id: crypto.randomUUID(),
      item: newTodoItem,
      completed: false,
    });
    addInputKey++;
    persistTodos();
  }

  function removeTodo(todoId: Todo["id"]) {
    const idx = todos.findIndex((todo) => todo.id === todoId);
    todos.splice(idx, 1);

    persistTodos();
  }

  function updateTodo(todoId: Todo["id"], updatedTodoText: Todo["item"]) {
    const idx = todos.findIndex((todo) => todo.id === todoId);
    if (idx === -1) return;

    const todo = todos[idx];

    if (!updatedTodoText.length) {
      removeTodo(todoId);
      return;
    }

    todos[idx] = {
      ...todo,
      item: updatedTodoText,
    };
    persistTodos();
  }

  function toggleTodoCompleted(todoId: Todo["id"]) {
    const idx = todos.findIndex((todo) => todo.id === todoId);
    const todo = todos[idx];

    if (idx !== -1) {
      todos[idx] = {
        ...todo,
        completed: !todo.completed,
      };
      persistTodos();
    }
  }
</script>

<div class="mt-30 flex flex-col gap-y-3 w-full items-center">
  <ul bind:this={todoULElement} class="flex flex-col w-full max-w-xl items-start gap-y-3">
    {#each todos as todo (todo.id)}
      <li class="flex items-center w-full group" data-id={todo.id}>
        <Checkbox
          id={todo.item}
          isChecked={todo.completed}
          handleOnChange={() => toggleTodoCompleted(todo.id)}
        >
          {#if todo.completed}
            {todo.item}
          {:else}
            <EditableText
              text={todo.item}
              placeholder="add todo..."
              handleOnSave={(updatedTodoText) => updateTodo(todo.id, updatedTodoText)}
            />
          {/if}
        </Checkbox>
        <button
          class="flex h-max items-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          onclick={() => removeTodo(todo.id)}
        >
          <TrashbinIcon class="hover:text-red-400" />
        </button>
      </li>
    {/each}
  </ul>
  <div class="add-new-todo-input-block flex w-full max-w-xl">
    <label class="flex items-center gap-x-2.5 cursor-pointer text-4xl">
      <input
        disabled={true}
        class="w-6 h-6"
        type="checkbox"
        checked={false}
        id="add your todo input checkbox"
      />
      {#key addInputKey}
        <EditableText
          text=""
          placeholder="add todo..."
          handleOnSave={addTodo}
          defaultEditing={true}
          autofocus={true}
        />
      {/key}
    </label>
  </div>
</div>
