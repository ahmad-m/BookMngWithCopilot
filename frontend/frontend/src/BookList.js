// ...existing code...
const handleIdClick = (id) => {
  // Set the selected book ID in parent (App) and scroll to details section
  if (typeof window.setSelectedBookId === 'function') {
    window.setSelectedBookId(id);
    setTimeout(() => {
      const detailsSection = document.getElementById('book-details-section');
      if (detailsSection) {
        detailsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }
};
// ...existing code...
// In your table row rendering:
{books.map((book, idx) => (
  <tr
    key={book.id}
    onClick={() => handleIdClick(book.id)}
    style={{ cursor: 'pointer' }}
  >
    <td style={{ color: 'inherit', textDecoration: 'none' }}>
      {idx + 1}
    </td>
    {/* ...existing code for other columns... */}
  </tr>
))}
// ...existing code...
