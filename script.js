document.getElementById('year').textContent = new Date().getFullYear();

document.querySelectorAll('.genre-card').forEach((card) => {
  card.addEventListener('click', () => {
    const genre = card.dataset.genre || 'Film Score';
    document.querySelector('#demo').scrollIntoView({ behavior: 'smooth' });
    document.querySelectorAll('.demo-item strong')[0].textContent = `${genre} Score Demo`;
  });
});
