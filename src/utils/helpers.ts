interface User {
  email: string;
  [key: string]: any; // This allows other properties for flexibility
}

export const mockDelay = <T>(response: T, fail = false): Promise<T> =>
  new Promise((res, rej) => {
    setTimeout(() => {
      fail ? rej(response) : res(response);
    }, 1000);
  });

export const toggleState = (setter: React.Dispatch<React.SetStateAction<boolean>>): void => {
  setter((prev) => !prev);
};

export const emailExistsInMockUsers = (email: string, mockUsers: User[]): boolean =>
  mockUsers.some((user) => user.email.toLowerCase() === email.toLowerCase());
