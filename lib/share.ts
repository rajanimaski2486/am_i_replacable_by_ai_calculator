import { toPng } from 'html-to-image';

export async function downloadShareCard(elementId: string, filename: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    // Temporarily make it visible if it's hidden for the capture
    const originalStyle = element.style.cssText;
    element.style.display = 'block';
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    element.style.top = '-9999px';

    const dataUrl = await toPng(element, { 
      cacheBust: true,
      pixelRatio: 2,
    });

    element.style.cssText = originalStyle;

    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Error generating image', error);
  }
}

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(
    () => {
      // Optional: show a small toast notification here
      console.log('Copied to clipboard!');
    },
    (err) => {
      console.error('Could not copy text: ', err);
    }
  );
}

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
