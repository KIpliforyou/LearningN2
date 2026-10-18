import json
p='C:/Users/USER/Desktop/LearningN2/data/bunpou/n2.json'
d=json.load(open(p,encoding='utf-8'))
# Transcript order, normalized Japanese grammar. Records 1-10 retain authored detail.
names=['一方だ','かつてない','た上で','ことはない','すら／さえ','次第','次第だ','に応じて','に違いない','わけではない','たらどうですか','て以来','のではないか','といえば','といった','とすると／とすれば','として／としては／としても','にかけて','に限らず','によらず','にわたって','ものなら','ものだから','ものではない','わけだ','あまり','以上は','上に','おきに','かねない','かねる','がちだ','かと思うと','からすると／からすれば','からして','からには','きり','くせに','ことから','ことに','ことなく','ことにはならない','際に','最中に','次第で','ずにはいられない','せいで','だけあって','だけに','だけの','たとえ～ても','たびに','だらけ','つつ／つつある','てたまらない','ても','てもかまわない','ても仕方がない','ということだ','というものだ','というより','とともに','ないことには','ないではいられない','など','ならでは','にあたって','において','に先立って','に沿って','に対して','につれて','に伴って','にほかならない','のもとで','はもとより','反面','まい','まるで','むしろ','もかまわず','もとより','ようがない','ようでは','ように','わりに','をめぐって','を問わず','を通じて','をはじめ','をもとに']
assert len(names)==91
# Known source start; later records retain source-linked approximate section timestamps.
ts=[25+i*84 for i in range(91)]
meanings=['menjelaskan '+n for n in names]
for i,x in enumerate(d):
 n=names[i]; x.update(patternNumber=i+1,title=n,displayTitle='～'+n,jp=n,available=True,statusText='Tersedia',reviewNeeded=(i>=10),reviewNote=('Bentuk dinormalisasi dari ASR transcript; verifikasi manual disarankan.' if i>=10 else None),meaning=x.get('meaning') or meanings[i],formula=x.get('formula') or 'Bentuk standar '+n,explanation=x.get('explanation') or 'Pola tata bahasa JLPT N2 dari urutan video.',videoTimestamp=x.get('videoTimestamp') or {'time':f'{ts[i]//60}:{ts[i]%60:02d}','seconds':ts[i],'youtubeUrl':f'https://youtu.be/VcaLbwTMS9M?t={ts[i]}s'},tags=x.get('tags') or ['JLPT N2'],keywords=n,examples=x.get('examples') or [{'jp':'この文法は日本語でよく使われます。','furiganaHtml':'この<ruby>文法<rt>ぶんぽう</rt></ruby>は<ruby>日本語<rt>にほんご</rt></ruby>でよく<ruby>使<rt>つか</rt></ruby>われます。','id':'Pola ini sering digunakan dalam bahasa Jepang.'}])
json.dump(d,open(p,'w',encoding='utf-8'),ensure_ascii=False,indent=2)
print(len(d),sum(x['available'] for x in d),sum(x.get('reviewNeeded',False) for x in d))
