<script lang="ts">
  import type { Todo } from "../types";
  import { onMount } from "svelte";
  import Checkbox from "./Checkbox.svelte";
  import EditableText from "./EditableText.svelte";
  import { getItemFromChromeStorage, saveItemOnChromeStorage } from "../lib/chrome";
  import { NAMESPACE_USER_TODOS } from "../constants";

  let { todos }: { todos: Todo[] } = $props();
  let addInputKey = $state(0);

  onMount(() => {
    getItemFromChromeStorage(NAMESPACE_USER_TODOS, (value) => {
      const storedTodos = Object.values(value) as Todo[];
      if (Array.isArray(storedTodos)) {
        todos.push(...storedTodos);
      }
    });
  });

  function persistTodos() {
    saveItemOnChromeStorage(NAMESPACE_USER_TODOS, todos);
  }

  function addTodo(newTodoItem: Todo["item"]) {
    todos.push({
      id: crypto.randomUUID(),
      item: newTodoItem,
      completed: false,
    });
    addInputKey++;
    persistTodos();
  }

  function updateTodo(todoId: Todo["id"], updatedTodoText: Todo["item"]) {
    const idx = todos.findIndex((todo) => todo.id === todoId);
    const todo = todos[idx];

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

<div class="mt-30 flex flex-col w-full items-center">
  <ul class="flex flex-col w-full max-w-lg items-start gap-y-3">
    {#each todos as todo, idx (todo.id)}
      <li>
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
      </li>
    {/each}
    <li class="add-new-todo-input-block">
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
    </li>
  </ul>
</div>
