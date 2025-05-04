<script>
  // Grid configuration
  let gridSize = 3; // 3x3 grid by default
  let activeCell = null; // Track the currently active cell

  // Generate the grid cells
  $: gridCells = Array.from({ length: gridSize * gridSize }, (_, i) => ({
    id: i,
    row: Math.floor(i / gridSize),
    col: i % gridSize,
  }));

  // Reactive variable for tracking the grid layout
  $: gridTemplateColumns = `repeat(${gridSize}, minmax(0, 1fr))`;

  // Function to highlight a cell (will be used in the N-Back logic later)
  function highlightCell(cellId) {
    activeCell = cellId;
    setTimeout(() => {
      activeCell = null;
    }, 500); // Clear highlight after 500ms
  }
</script>

<main
  class="flex flex-col items-center justify-center min-h-screen bg-base-200 p-4"
>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <h1 class="card-title text-center mb-6">Dual N-Back Game</h1>

      <!-- Controls will go here later -->
      <div class="mb-4 flex gap-2">
        <button class="btn btn-primary">Start</button>
        <select class="select select-bordered">
          <option value="2">2-Back</option>
          <option value="3">3-Back</option>
          <option value="4">4-Back</option>
        </select>
      </div>

      <!-- Main Grid -->
      <div
        class="grid gap-2 w-full max-w-md mx-auto aspect-square"
        style="grid-template-columns: {gridTemplateColumns};"
      >
        {#each gridCells as cell}
          <div
            class="bg-base-300 rounded-lg flex items-center justify-center transition-colors duration-200 shadow-sm hover:bg-base-200"
            class:bg-primary={activeCell === cell.id}
            class:text-primary-content={activeCell === cell.id}
          ></div>
        {/each}
      </div>

      <!-- Audio indicator will go here -->
      <div class="mt-6 text-center text-xl font-bold h-8">
        <!-- Audio stimulus display here -->
      </div>

      <!-- Response buttons will go here -->
      <div class="mt-4 flex justify-center gap-4">
        <button class="btn">Position Match (A)</button>
        <button class="btn">Audio Match (L)</button>
      </div>
    </div>
  </div>
</main>

<style>
  /* Additional styles if needed beyond Tailwind */
</style>
