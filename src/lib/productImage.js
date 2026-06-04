// helper กลางสำหรับสร้าง placeholder ของรูปหนังสือ
// ใช้ร่วมกันทุกหน้าที่แสดง product image เพื่อให้โทนภาพสม่ำเสมอทั้งแอป

const PLACEHOLDER_WIDTH = 400;
const PLACEHOLDER_HEIGHT = 600;
const PLACEHOLDER_BG = "D6C7B8";
const PLACEHOLDER_TEXT = "2F3B52";
const MAX_PLACEHOLDER_TITLE_LENGTH = 18;

export function getProductTitle(product) {
  return (
    product?.name ||
    product?.book_name ||
    product?.title ||
    "Book Cover"
  );
}

export function shortenPlaceholderTitle(title) {
  const safeTitle = String(title || "Book Cover").trim();

  if (safeTitle.length <= MAX_PLACEHOLDER_TITLE_LENGTH) {
    return safeTitle;
  }

  return `${safeTitle.slice(0, MAX_PLACEHOLDER_TITLE_LENGTH)}...`;
}

export function createProductPlaceholder(title) {
  const shortTitle = shortenPlaceholderTitle(title);
  const encodedTitle = encodeURIComponent(shortTitle);

  return `https://placehold.co/${PLACEHOLDER_WIDTH}x${PLACEHOLDER_HEIGHT}/${PLACEHOLDER_BG}/${PLACEHOLDER_TEXT}?text=${encodedTitle}`;
}

export function getProductImage(product) {
  // รอบนี้ตั้งใจคืน placeholder ทุกครั้งเพื่อให้ภาพทุกหน้ามีสไตล์เดียวกัน
  return createProductPlaceholder(getProductTitle(product));
}
