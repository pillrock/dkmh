import { useEffect, useState } from "react";

/**
 * useDebounce
 * Trả về giá trị sau một khoảng delay, chỉ thay đổi khi người dùng ngừng nhập.
 * @param value Giá trị cần debounce
 * @param delay Thời gian chờ (ms), mặc định 300ms
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
