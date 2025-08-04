export function stripIndents(value: string): string;
export function stripIndents(strings: TemplateStringsArray, ...values: any[]): string;
export function stripIndents(arg0: string | TemplateStringsArray, ...values: any[]) {
  if (typeof arg0 !== 'string') {
    const processedString = arg0.reduce((acc, curr, i) => {
      acc += curr + (values[i] ?? '');
      return acc;
    }, '');

    return _stripIndents(processedString);
  }

  return _stripIndents(arg0);
}

function _stripIndents(value: string) {
  // remove a leading newline that is common when using template strings
  const lines = value.replace(/^\n/, '').split('\n');

  // determine the smallest indentation level of all non-empty lines
  let indent = Infinity;

  for (const line of lines) {
    if (!line.trim()) {
      continue;
    }

    const currentIndent = line.match(/^\s*/)?.[0].length ?? 0;
    if (currentIndent < indent) {
      indent = currentIndent;
    }
  }

  if (!Number.isFinite(indent)) {
    indent = 0;
  }

  // slice the common indentation from each line and remove trailing newlines
  return lines.map((line) => line.slice(indent)).join('\n').replace(/[\r\n]+$/, '');
}
