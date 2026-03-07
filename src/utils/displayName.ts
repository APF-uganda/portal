type NameSource = {
  full_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
};

const toTitleCase = (value: string) =>
  value
    .toLowerCase()
    .replace(/\b[a-z]/g, (char) => char.toUpperCase());

const splitCompactToken = (token: string): string[] => {
  if (token.length < 12) {
    return [token];
  }

  const mid = Math.floor(token.length / 2);
  let splitAt = mid;
  const isVowel = (char: string) => /[aeiou]/i.test(char);

  for (let offset = 0; offset <= 4; offset++) {
    const left = mid - offset;
    const right = mid + offset;

    if (
      left >= 4 &&
      left <= token.length - 4 &&
      isVowel(token[left - 1]) &&
      !isVowel(token[left])
    ) {
      splitAt = left;
      break;
    }

    if (
      right >= 4 &&
      right <= token.length - 4 &&
      isVowel(token[right - 1]) &&
      !isVowel(token[right])
    ) {
      splitAt = right;
      break;
    }
  }

  return [token.slice(0, splitAt), token.slice(splitAt)];
};

export const getDisplayName = (
  profile: NameSource | null | undefined,
  fallback: string
): string => {
  const fullNameFromParts = [profile?.first_name, profile?.last_name]
    .filter((part): part is string => Boolean(part?.trim()))
    .join(" ");

  const cleanProfileName = [profile?.full_name?.trim(), fullNameFromParts]
    .find((name) => Boolean(name && !/\d/.test(name ?? "")))
    ?.replace(/[^a-zA-Z\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const emailLocalPart = profile?.email?.split("@")[0] ?? "";
  const emailTokens = emailLocalPart
    .split(/[._-\s]+/)
    .flatMap((segment) => segment.match(/[a-zA-Z]+/g) ?? [])
    .flatMap((token) => splitCompactToken(token))
    .slice(0, 2)
    .map(toTitleCase);

  return cleanProfileName || emailTokens.join(" ").trim() || fallback;
};
