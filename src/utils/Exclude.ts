export function exclude<UserType extends Record<string, any>, Key extends keyof UserType>(
    user: UserType,
    keys: Key[]
  ): Omit<UserType, Key> {
    const filteredUser: Partial<UserType> = {};
    for (const [key, value] of Object.entries(user)) {
      if (!keys.includes(key as Key)) {
        filteredUser[key as keyof UserType] = value;
      }
    }
    return filteredUser as Omit<UserType, Key>;
  }
  