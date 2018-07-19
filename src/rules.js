const rules = [
  {
    id: 'FILLER_WORDS',
    class: 'AbstractFillerWordsRule',
    description: `
      A rule that gives hints about the use of filler words.\n 
      The hints are only given when the percentage of filler words per paragraph exceeds the given limit.\n
      A limit of 0 shows all used filler words. Direct speech or citation is excluded otherwise.\n 
      This rule detects no grammar error but gives stylistic hints (default off).
    `
  },
  {
    id: 'PUNCUATION_GENERIC_CHECK',
    class: 'AbstractPunctuationCheckRule',
    description: `A rule that matches "..", "::", "-," but not "...", "!..", "?!!", ",-" etc.`
  },
  {
    id: 'SIMPLE_REPLACE',
    class: 'AbstractSimpleReplaceRule',
    description: `A rule that matches words which should not be used and suggests correct ones instead.`
  },
  {
    id: 'SPACE_BEFORE_CONJUNCTION',
    class: 'AbstractSpaceBeforeRule',
    description: `An abstract rule that checks if there is a missing space before some conjunctions.`
  },
  {
    id: 'STYLE_REPEATED_WORD_RULE',
    class: 'AbstracctStyleRepeatedWordRule',
    description: `
      An abstract rule checks the appearance of same words in a sentence or in two consecutive sentences.\n
      This rule detects no grammar error but a stylistic problem (default off)
    `
  },
  {
    id: 'COMMA_PARENTHESIS_WHITESPACE',
    class: 'CommaWhitespaceRule',
    description: `A rule that matches periods, commas and closing parenthesis preceded by whitespace and opening parenthesis followed by whitespace.`
  },
  {
    id: 'DOUBLE_PUNCTUATION',
    class: 'DoublePunctuationRule',
    description: `A rule that matches ".." (but not "..." etc) and ",,".`
  },
  {
    id: 'EMPTY_RULE',
    class: 'EmptyLineRule',
    description: `A rule that checks for empty lines.`
  },
  {
    id: 'UNPAIRED_BRACKETS',
    class: 'GenericUnpairedBracketsRule',
    description: `Rule that finds unpaired quotes, brackets etc.`
  },
  {
    id: 'TOO_LONG_PARAGRAPH',
    class: 'LongParagraphRule',
    description: `A rule that warns on long paragraphs. Note that this rule is off by default.`
  },
  {
    id: 'TOO_LONG_SENTENCE',
    class: 'LongSentenceRule',
    description: `A rule that warns on long sentences. Note that this rule is off by default.`
  },
  {
    id: 'WHITESPACE_RULE',
    class: 'MultipleWhitespaceRule',
    description: `
      Check if there is duplicated whitespace in a sentence.\n
      Considers two spaces as incorrect, and proposes a single space instead.
    `
  },
  {
    id: 'PARAGRAPH_REPEAT_BEGINNING_RULE',
    class: 'ParagraphRepeatBeginningRule',
    description: `
      Check if to paragraphs begin with the same word.
      If the first word is an article it checks if the first two words are identical
    `
  },
  {
    id: 'PUNCTUATION_PARAGRAPH_END',
    class: 'PunctuationMarkAtParagraphEnd',
    description: `A rule that checks for a punctuation mark at the end of a paragraph`
  },
  {
    id: 'SENTENCE_WHITESPACE',
    class: 'SentenceWhitespaceRule',
    description: `Checks that there's whitespace between sentences.`
  },
  {
    id: 'UPPERCASE_SENTENCE_START',
    class: 'UppercaseSentenceStartRule',
    description: `Checks that a sentence starts with an uppercase letter.`
  },
  {
    id: 'WHITESPACE_PARAGRAPH_BEGIN',
    class: 'WhiteSpaceAtBeginOfParagraph',
    description: `A rule that checks for WhiteSpaces at the begin of a paragraph`
  },
  {
    id: 'WHITESPACE_PARAGRAPH',
    class: 'WhiteSpaceBeforeParagraphEnd',
    description: `A rule that checks for a whitespace at the end of a paragraph`
  },
  {
    id: 'WORD_REPEAT_BEGINNING_RULE',
    class: 'WordRepeatBeginningRule',
    description: `
      Check if three successive sentences begin with the same word, e.g.\n 
      "I am Max. I am living in Germany. I like ice cream.",\n
      and if two successive sentences begin with the same adverb, e.g.\n 
      "Furthermore, he is ill. Furthermore, he likes her."
    `
  },
  {
    id: 'WORD_REPEAT_RULE',
    class: 'WordRepeatRule',
    description: `Check if a word is repeated twice, e.g. "the the".`
  },
  {
    id: 'WRONG_WORD_IN_CONTEXT',
    class: 'WrongWordInContextRule',
    description: `Check if there is a confusion of two words (which might have a similar spelling) depending on the context.`
  },
  {
    id: 'DASH_RULE',
    class: '',
    description: `
      Another use of the compounds file -- check for compounds written with\n
      dashes instead of hyphens (for example, Rabka — Zdrój).
    `
  }
]

export { rules }