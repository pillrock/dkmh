export const nameKeyLocalStorage = {
  access_token: "accessToken-service",
  dataUser: "data-user",
  subjectsChosen: "subjects-Chosen",
};

export const saveToLocalStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to localStorage: ${error}`);
  }
};

// Hàm lấy dữ liệu từ localStorage
export const getFromLocalStorage = <T>(key: string): T | null => {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch (error) {
    console.error(`Error retrieving from localStorage: ${error}`);
    return null;
  }
};

// Hàm xóa dữ liệu khỏi localStorage
export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage: ${error}`);
  }
};
