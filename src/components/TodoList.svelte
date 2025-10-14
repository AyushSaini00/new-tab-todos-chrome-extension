<script lang="ts">
  import { onMount } from "svelte";
  import type { Todo } from "../types";
  import type { SortableEvent } from "sortablejs";
  import Sortable from "./Sortable.svelte";
  import Checkbox from "./Checkbox.svelte";
  import EditableText from "./EditableText.svelte";
  import TrashbinIcon from "./icons/TrashbinIcon.svelte";
  import LayoutGridIcon from "./icons/LayoutGridIcon.svelte";
  import { getItemFromChromeStorage, saveItemOnChromeStorage } from "../lib/chrome";
  import { NAMESPACE_USER_TODOS } from "../constants";

  let { todos = $bindable() }: { todos: Todo[] } = $props();
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

  function reOrderItems<T>(items: T[], oldIndex?: number, newIndex?: number) {
    if (oldIndex === undefined || newIndex === undefined) return items;
    if (oldIndex === newIndex) return items;

    const copy = $state.snapshot(items);

    const [movedItem] = copy.splice(oldIndex, 1);
    copy.splice(newIndex, 0, movedItem);

    return copy;
  }
</script>

<div class="mt-30 flex flex-col gap-y-3 w-full items-center">
  <Sortable
    options={{
      handle: ".sortablejs-handle",
      onEnd: (evt: SortableEvent) => {
        const { oldIndex, newIndex } = evt;
        todos = reOrderItems(todos, oldIndex, newIndex);
        persistTodos();
      },
    }}
    class="flex flex-col w-full max-w-xl items-start gap-y-3"
  >
    <!-- FIX-ME: use todo.id as key
       since sortablejs is updating the DOM instead of svelte (because that's how the library is made)
       there are some caveats (like irregular order) as svelte tried to update the UI
       so for now, we are using the entire obj as key (this is tbh similar to not using a key at all)
       so svelte will recreate this list every time it is sorted
       again, this is not a good approach, but workds for now. 
  -->
    {#each todos as todo (todo)}
      <li class="flex items-center w-full group">
        <div
          class="flex cursor-grab opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <LayoutGridIcon />
        </div>
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
  </Sortable>
  <div class="add-new-todo-input-block flex w-full max-w-xl">
    <div class="w-6 h-6"></div>
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
