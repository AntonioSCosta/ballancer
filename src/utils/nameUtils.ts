
export const shortenPlayerName = (fullName: string): string => {
  const nameParts = fullName.trim().split(' ');
  
  if (nameParts.length <= 1) {
    return fullName;
  }
  
  // Get first name initial and last name
  const firstInitial = nameParts[0][0].toUpperCase();
  const lastName = nameParts[nameParts.length - 1];
  
  return `${firstInitial}.${lastName}`;
};
