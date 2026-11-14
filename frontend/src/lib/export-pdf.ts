/**
 * Télécharge un élément de la page en PDF A4 (sans passer par l'impression).
 *
 * L'élément est rendu en image par le navigateur (html-to-image, qui gère les
 * couleurs oklch de Tailwind 4), puis découpé en pages A4 par jsPDF.
 * Les deux bibliothèques sont chargées à la demande pour ne pas alourdir l'app.
 */
export async function downloadPdf(element: HTMLElement, filename: string) {
  const [{ toCanvas }, { jsPDF }] = await Promise.all([import('html-to-image'), import('jspdf')]);

  const canvas = await toCanvas(element, {
    pixelRatio: 2,
    backgroundColor: '#ffffff',
    // Les boutons (télécharger, fermer…) ne doivent pas apparaître dans le PDF.
    filter: (node) => !(node instanceof HTMLElement && node.dataset.pdfHidden !== undefined),
  });

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
  const margin = 10;
  const pageWidth = pdf.internal.pageSize.getWidth() - margin * 2;
  const pageHeight = pdf.internal.pageSize.getHeight() - margin * 2;

  // Hauteur (en pixels du canvas) qui tient sur une page.
  const sliceHeight = Math.floor((canvas.width * pageHeight) / pageWidth);
  const slice = document.createElement('canvas');
  slice.width = canvas.width;

  for (let y = 0, page = 0; y < canvas.height; y += sliceHeight, page += 1) {
    const height = Math.min(sliceHeight, canvas.height - y);
    slice.height = height;
    const ctx = slice.getContext('2d');
    if (!ctx) throw new Error('Impossible de préparer le PDF sur cet appareil.');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, slice.width, height);
    ctx.drawImage(canvas, 0, y, canvas.width, height, 0, 0, canvas.width, height);

    if (page > 0) pdf.addPage();
    pdf.addImage(slice.toDataURL('image/jpeg', 0.92), 'JPEG', margin, margin, pageWidth, (height * pageWidth) / canvas.width);
  }

  pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
}
