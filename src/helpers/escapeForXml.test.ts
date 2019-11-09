import escapeForXml from './escapeForXml';

test('SHould be a function', () => {
    expect(typeof escapeForXml).toBe('function');
});

test('Should return empty string if not a string', () => {
    expect(escapeForXml(5)).toBe('');
    expect(escapeForXml({})).toBe('');
    expect(escapeForXml(-5)).toBe('');
});

test('Should valid string', () => {
    expect(escapeForXml('This is me')).toBe('This is me');
    expect(escapeForXml('Brunch "is & me')).toBe('Brunch &quot;is &amp; me');
    expect(escapeForXml('& Brunch "is "me &')).toBe('&amp; Brunch &quot;is &quot;me &amp;');
    expect(escapeForXml('Brunch \'is \'me')).toBe('Brunch &apos;is &apos;me');
    expect(escapeForXml('Brunch <is> me <now>')).toBe('Brunch &lt;is&gt; me &lt;now&gt;');
});
