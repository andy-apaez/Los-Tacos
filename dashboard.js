document.addEventListener('DOMContentLoaded', () => {
  const firebaseConfig = {
    apiKey: "AIzaSyDulbBti8Nw-3rn7TVnTy_-LXAnv0qiZ_4",
    authDomain: "lostacosbk-f6beb.firebaseapp.com",
    projectId: "lostacosbk-f6beb",
    storageBucket: "lostacosbk-f6beb.firebasestorage.app",
    messagingSenderId: "195303768634",
    appId: "1:195303768634:web:6ad7735db3dc4d48406b03",
    measurementId: "G-4XSGKESEY7"
  };

  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();

  const ordersTableBody = document.getElementById('ordersTableBody');
  const logoutBtn = document.getElementById('logoutBtn');

  logoutBtn.addEventListener('click', () => {
    auth.signOut()
      .then(() => window.location.href = 'menu.html')
      .catch(error => alert('Logout failed: ' + error.message));
  });

  auth.onAuthStateChanged(user => {
    if (!user) {
      window.location.href = 'menu.html';
      return;
    }

    db.collection('orders').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      ordersTableBody.innerHTML = '';

      if (snapshot.empty) {
        ordersTableBody.innerHTML = '<tr><td colspan="4">No orders found.</td></tr>';
        return;
      }

      const fragment = document.createDocumentFragment();

      snapshot.forEach(doc => {
        const data = doc.data();
        const id = doc.id;

        const itemsText = (data?.items ?? []).map(i => {
          const notes = i.instructions ? ` (Notes: ${i.instructions})` : '';
          return `${i.name} x${i.qty}${notes}`;
        }).join(', ');

        const totalText = `$${(data?.total ?? 0).toFixed(2)}`;
        const timestampText = data?.timestamp
          ? new Date(data.timestamp.seconds * 1000).toLocaleString()
          : '';

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${id}</td>
          <td>${itemsText}</td>
          <td>${totalText}</td>
          <td>${timestampText}</td>
        `;
        fragment.appendChild(tr);
      });

      ordersTableBody.appendChild(fragment);
    });
  });
});
