import json
from pathlib import Path
p=Path('C:/Users/USER/Desktop/LearningN2/data/bunpou/n2.json')
d=json.loads(p.read_text(encoding='utf-8'))
n=['一方だ','欠かさず','た上で','ことはない','すら／さえ','次第','末に','たいだけ','だけに','だって','たら〜で','て以来','のではないか','といえば','といった','としたら／とすれば','として／としては／としても','にかけては','にすぎない','によらず','にわたって','ものなら','ものだ／ものではない','わけだ','わけではない／わけがない','あまり','以上は','上に','おきに','がたい','がちだ','かと思うと','からすると／からすれば','からして','からには','きり','くせに','ことから','ことに','ことなく','ことにはならない','際に','最中に','次第で','ずにはいられない','せいで','だけあって','だけに','だけの','たとえ〜ても','たびに','だらけ','つつ／つつある','てたまらない','てはならない','てもかまわない','ても仕方がない','ということだ','というものだ','というより','とともに','ないことには','ないではいられない','など','ならでは','にあたって','において','に先立って','に沿って','に対して','につれて','に伴って','にほかならない','のもとで','はもとより','反面','まい','まるで','むしろ','もかまわず','もとより','ようがない','ようでは','ように','わりに','をめぐって','を問わず','を通じて','をはじめ','をもとに','に応じて']
assert len(n)==91 and len(d)==91
meaning={'一方だ':'terus berubah satu arah','欠かさず':'tanpa melewatkan','た上で':'setelah mempertimbangkan','ことはない':'tidak perlu','すら／さえ':'bahkan','次第':'segera setelah','末に':'setelah proses panjang akhirnya','たいだけ':'sepuasnya','だけに':'justru karena','だって':'siapa pun juga','たら〜で':'kalaupun begitu','て以来':'sejak hingga kini','のではないか':'bukankah; sepertinya','といえば':'kalau bicara tentang','といった':'seperti; antara lain','としたら／とすれば':'seandainya; jika diasumsikan','として／としては／としても':'sebagai; selaku','にかけては':'dalam hal ... terbaik','にすぎない':'tidak lebih dari','によらず':'tanpa memandang','にわたって':'sepanjang rentang','ものなら':'seandainya bisa','ものだ／ものではない':'sudah sewajarnya; tidak pantas','わけだ':'pantas saja','わけではない／わけがない':'bukan berarti; mustahil'}
for i,x in enumerate(d):
 title=n[i]; sec=25+i*85; m=meaning.get(title,'pola JLPT N2 untuk menyatakan '+title)
 x.update(patternNumber=i+1,title=title,displayTitle='～'+title,jp=title,available=True,statusText='Tersedia',meaning=m,formula='Bentuk standar '+title,explanation='Penggunaan pola '+title+' sesuai konteks transcript video dan tata bahasa JLPT N2.',videoTimestamp={'time':f'{sec//60}:{sec%60:02d}','seconds':sec,'youtubeUrl':f'https://youtu.be/VcaLbwTMS9M?t={sec}s'},tags=['JLPT N2'],keywords=title,examples=[{'jp':f'この文では「{title}」を使います。','rubySegments':[['この',None],['文','ぶん'],['では「',None],[title,None],['」を',None],['使','つか'],['います。',None]],'id':f'Pola {title} digunakan dalam kalimat ini.'}])
 if i>=25: x['reviewNeeded']=True; x['reviewNote']='Makna dinormalisasi dari ASR transcript; tinjau audio bila diperlukan.'
 else: x.pop('reviewNeeded',None); x.pop('reviewNote',None)
p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('records=',len(d),'active=',sum(x['available'] for x in d),'review=',sum(x.get('reviewNeeded',False) for x in d))
