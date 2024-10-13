import spacy


nlp = spacy.load('en_core_web_sm')

def extract_assertions(text):
    doc = nlp(text)
    assertions = {}
    last_subject = None

    for sent in doc.sents:
        
        subject = None
        attribute = None
        negation = False
        contradiction = False

        for token in sent:
            if token.dep_ in ['nsubj', 'nsubjpass'] or (token.pos_ in ['NOUN', 'PROPN'] and not subject):
                subject = token.lemma_.lower()
            

            if token.dep_ in ['acomp', 'attr', 'prep', 'dobj', 'oprd', 'amod']:
                attribute = token.lemma_.lower()


            if token.dep_ == 'neg':
                negation = True

            if token.dep_ == 'cc' and token.lemma_.lower() in ['but', 'however', 'although', 'yet']:
                contradiction = True


            if token.dep_ == 'conj' and (token.head.dep_ in ['acomp', 'attr', 'prep', 'dobj', 'oprd', 'amod']):
                attribute = token.lemma_.lower()
                if any(child.dep_ == 'neg' for child in token.children):
                    negation = True
                    
        if contradiction:
            print(f"Contradiction detected: {subject}, {attribute} (Negation: {negation})")
        else:
            print(f"Subject: {subject}, Attribute: {attribute} (Negation: {negation})")

        if not subject and last_subject:
            subject = last_subject

        if subject and attribute:
            attr_str = f"not {attribute}" if negation else attribute
            if subject not in assertions:
                assertions[subject] = []
            assertions[subject].append(attr_str)

        if subject:
            last_subject = subject

    return assertions

def detect_contradictions(text):
    assertions = extract_assertions(text)
    contradictions = 0

    for subject, attrs in assertions.items():
        for i in range(len(attrs)):
            for j in range(i + 1, len(attrs)):
                if (attrs[i] == f"not {attrs[j]}") or (attrs[j] == f"not {attrs[i]}") or (attrs[i] != attrs[j] and not attrs[i].startswith("not") and not attrs[j].startswith("not")):
                    contradictions += 1

    return contradictions


def space(txt : str):
    
    contradictions = detect_contradictions(txt)
    print(contradictions)
    return contradictions

if __name__ == "__main__":
    space("The patient has a fever but does not have a fever")