/**
 * サイト全体の設定値
 * URL などは後から自由に差し替えてください。
 */

// 国追加リクエストの送信先
// GitHub Issues の場合：
//   https://github.com/<owner>/<repo>/issues/new?title=...&labels=data-request
// Google フォームの場合：
//   https://forms.gle/xxxxxxxx
export const REQUEST_COUNTRY_URL =
  'https://github.com/your-username/gender-platform/issues/new' +
  '?title=%E3%83%87%E3%83%BC%E3%82%BF%E8%BF%BD%E5%8A%A0%E3%83%AA%E3%82%AF%E3%82%A8%E3%82%B9%E3%83%88' +
  '&labels=data-request' +
  '&body=%E8%BF%BD%E5%8A%A0%E3%81%97%E3%81%A6%E3%81%BB%E3%81%97%E3%81%84%E5%9B%BD%EF%BC%9A%0A%0A%E7%90%86%E7%94%B1%EF%BC%9A';
