export function getUserFromEmail(email: string) {
  const [_, domain] = email.split("@");
  return domainToId[domain];
}

const domainToId: Record<string, string> = {
  "gmail.com": "123",
  "yahoo.com": "456",
  "viaplaygroup.com": "789",
};
