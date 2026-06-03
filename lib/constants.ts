export const PHONE = process.env.NEXT_PUBLIC_PHONE ?? "0972916382";
export const ZALO = process.env.NEXT_PUBLIC_ZALO_NUMBER ?? PHONE;

export function formatPhoneDisplay(phone: string) {
  return phone.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
}
