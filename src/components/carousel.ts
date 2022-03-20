export const carousel = (data: any) => {
  const basic = `
    <main>
      <button id="prev">&lt;</button>
      <div class="card-container"></div>
      <button id="next">&gt;</button>
    </main>
  `;

  const genCard = (src: string) => {
    return `
      <div class="card view">
        <div class="card-image">
          <img src="${src}" alt="some picture">
        </div>
        <a href="https://hariramjp777.github.io/frontend-todo-app/" target="_blank">App</a>
      </div>
    `;
  };

  return;
};
