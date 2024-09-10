const input = document.querySelector('input');
const btn = document.querySelector('button');
btn.addEventListener('click', () => {
    navigator.clipboard.writeText(input.value);
}

)