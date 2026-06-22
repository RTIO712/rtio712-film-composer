document.getElementById('year').textContent = new Date().getFullYear();

document.querySelectorAll('.genre-card').forEach((card) => {
  card.addEventListener('click', (event) => {
    if (event.target.closest('input') || event.target.closest('audio') || event.target.closest('label')) return;
    const audio = card.querySelector('audio');
    if (audio) audio.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});

document.querySelectorAll('.audio-upload').forEach((input) => {
  input.addEventListener('change', (event) => {
    const file = event.target.files && event.target.files[0];
    const targetId = input.dataset.target;
    const labelId = input.dataset.label;
    const audio = document.getElementById(targetId);
    const label = document.getElementById(labelId);
    if (!file || !audio) return;
    const url = URL.createObjectURL(file);
    audio.src = url;
    audio.load();
    if (label) {
      label.textContent = `선택된 파일: ${file.name} / Selected: ${file.name}`;
    }
  });
});
