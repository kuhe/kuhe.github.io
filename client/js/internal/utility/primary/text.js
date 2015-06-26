var mode = 'n';

text = function(phrase, override) {
    if (!mode) mode = 'n';
    var string = {
        n : {
            empty: '-',
            ' 1st' : '1番',
            ' 2nd' : '2番',
            ' 3rd' : '3番',
            ' 4th' : '4番',
            ' 5th' : '5番',
            ' 6th' : '6番',
            ' 7th' : '7番',
            ' 8th' : '8番',
            ' 9th' : '9番',
            'Now batting' : '次のバッター、',
            'way outside' : '相当外角',
            'outside' : '外角',
            'inside' : '内角',
            'way inside' : '相当内角',
            'way low' : '相当低め',
            'low' : '低め',
            'high' : '高め',
            'way high' : '相当高め',
            'down the middle' : '真ん中',
            'first baseman': 'ファースト',
            'second baseman': 'セカンド',
            'third baseman': 'サード',
            'shortstop': 'ショート',
            'pitcher': 'ピッチャー',
            'catcher': 'キャッチャー',
            'left fielder': 'レフト',
            'center fielder': 'センター',
            'right fielder': 'ライト',
            'Strike.' : 'ストライク。',
            'Ball.' : 'ボール。',
            'Fouled off.': 'ファウル。',
            'In play.': 'インプレー。',
            'Swinging strike.': '空振り。',
            '4-seam': 'ストレート',
            '2-seam': 'シュート',
            'slider': 'スライダー',
            'fork': 'フォーク',
            'cutter': 'カット',
            'sinker': 'シンカー',
            'curve': 'カーブ',
            'change': 'チェンジ',
            ' struck out looking.': '、見逃し三振。',
            ' walked.': '、フォアボール。',
            ' struck out swinging.': '、空振り三振。',
            'Previous: ': '前：',
            'looks like: ': '予想',
            'breaking ball': '変化球',
            'fastball': 'ストレート',
            'Batting, ': '打球',
            'Catching, pitch selection': '捕球選択',
            'Season': '記録',
            'Game': '今試合',
            'Pitch': '球',
            'Control': '制球',
            'Velocity': '速度',
            'Break': '変化',
            'At Bat :': 'バッター',
            'On Deck :': '次バッター',
            'Eye :': '目',
            'Power :': '力',
            'Speed :': '速',
            'Up to Bat': '打席',
            'Fielding': '守備',
            'BA' : '打率',
            'OBP' : '出塁',
            'SLG' : '長打',
            'PA' : '打席',
            'H/2B/3B/HR' : '安／二／三／本',
            'H' : '安',
            '2B' : '二',
            '3B' : '三',
            'HR' : '本塁打',
            'RBI' : '打点',
            'R' : '得点',
            'BB' : '四球',
            'SO' : '三振',

            'first' : 'ファースト',
            'second' : 'セカンド',
            'third' : 'サード',

            'Select Language:' : '言語',
            'Run Fast Simulation' : 'シミュレーションを試合終了まで行う',
            'Play Ball!' : 'プレーボール',
            'Spectate the CPU': 'CPU観戦',

            'Throws/Bats' : ' ',
            'LHP' : '左投',
            'RHP' : '右投',
            'LHB' : '左打',
            'RHB' : '右打',
            'L' : '左投',
            'R ' : '右投',
            ' L ' : '左打',
            ' R ' : '右打',
            '#' : '背番号'
        },
        e : {
            empty: '-',
            'Season': 'Career'
        }
    }[override ? override : mode][phrase];
    return string ? string : phrase;
};

text.getBattersEye = function(game) {
    var eye = {},
        breaking = Math.abs(game.pitchInFlight.breakDirection[0]) + Math.abs(game.pitchInFlight.breakDirection[1]) > 40;
    eye.e =
        text('looks like: ', 'e')+
        breaking ? text('breaking ball', 'e') : text('fastball', 'e');
    eye.n =
        text('looks like: ', 'n')+
        breaking ? text('breaking ball', 'n') : text('fastball', 'n');
    return eye;
};

text.fielderShortName = function(fielder) {
    if (mode == 'n') {
        return {
            'first': '一',
            'second': '二',
            'third': '三',
            'short': '遊',
            'pitcher': '投',
            'catcher': '捕',
            'left': '左',
            'center': '中',
            'right': '右'
        }[fielder];
    }
    return fielder;
};

text.slash = function() {
    if (mode == 'n') {
        return '・';
    }
    return '/';
};

text.fielderLongName = function(fielder) {
    if (mode == 'n') {
        return {
            'first': 'ファースト',
            'second': 'セカンド',
            'third': 'サード',
            'short': 'ショート',
            'pitcher': 'ピッチャー',
            'catcher': 'キャッチャー',
            'left': 'レフト',
            'center': 'センター',
            'right': 'ライト'
        }[fielder]
    }
    return {
        first : text('first baseman'),
        second : text('second baseman'),
        third : text('third baseman'),
        short : text('shortstop'),
        pitcher : text('pitcher'),
        catcher : text('catcher'),
        left : text('left fielder'),
        center : text('center fielder'),
        right : text('right fielder')
    }[fielder];
};

text.comma = function() {
    return {n: '、', e: ', '}[mode];
};
text.stop = function() {
    return {n: '。', e: '. '}[mode];
};

text.namePitch = function(pitch) {
    if (mode == 'e') {
        return pitch.name.charAt(0).toUpperCase() + pitch.name.slice(1)
    }
    if (mode == 'n') {
        return text(pitch.name)
    }
};

text.contactResult = function(batter, fielder, bases, outBy, sacrificeAdvances, out) {
    var statement = '';
    var infield = ['left', 'center', 'right'].indexOf(fielder) < 0;
    if (mode == 'e') {
        statement += batter;
        if (outBy) {
            switch (outBy) {
                case 'fieldersChoice':
                    var plural = out.length > 1;
                    var runner = plural ? 'Runners' : 'Runner';
                    var is = plural ? 'are' : 'is';
                    statement += ' reached on a fielder\'s choice by ' + text.fielderShortName(fielder) + '. '+runner+' from ' + text(out.join(text.comma())) + ' ' + is + ' out';
                    break;
                case 'line':
                    statement += ' lined out to ' + text.fielderShortName(fielder);
                    break;
                case 'fly':
                    statement += ' flew out to ' + text.fielderShortName(fielder);
                    break;
                case 'error':
                    statement += ' reached on error by ' + text.fielderShortName(fielder);
                    break;
                case 'pop':
                    statement += ' popped out to ' + text.fielderShortName(fielder);
                    break;
                case 'ground':
                    statement += ' grounded into a force out by ' + text.fielderShortName(fielder);
                    break;
                case 'thrown':
                    statement += ' was thrown out by ' + text.fielderShortName(fielder);
                    break;
            }
        } else {
            switch (bases) {
                case 1:
                    if (infield) {
                        statement += ' reached on an infield hit to ' + text.fielderShortName(fielder);
                    } else {
                        statement += ' reached on a single to ' + text.fielderShortName(fielder);
                    }
                    break;
                case 2:
                    statement += ' doubled past ' + text.fielderShortName(fielder);
                    break;
                case 3:
                    statement += ' tripled past ' + text.fielderShortName(fielder);
                    break;
                case 4:
                    statement += ' homered to ' + text.fielderShortName(fielder);
                    break;
            }
        }
        if (sacrificeAdvances) {
            sacrificeAdvances.map(function(base) {
                if (base == 'third') {
                    statement += text.stop() + 'Runner on third scores';
                } else {
                    statement += text.stop() + 'Runner on ' + base + ' advances';
                }
            });
        }
        statement += text.stop();
    }
    if (mode == 'n') {
        var stop = text.stop();
        statement += batter + 'は';
        if (outBy) {
            var fielderLong = text.fielderLongName(fielder);
            fielder = text.fielderShortName(fielder);
            switch (outBy) {
                case 'fieldersChoice':
                    statement += '野選('+fielder+')で出塁。' + text(out.join(text.comma())) + 'ランナーはアウト';
                    break;
                case 'line':
                    statement += fielder + '直';
                    break;
                case 'fly':
                    statement += fielder + '飛';
                    break;
                case 'error':
                    statement += 'エラー('+fielder+')で出塁';
                    break;
                case 'pop':
                    statement += 'ポップフライで' + fielder + '飛';
                    break;
                case 'ground':
                    statement += fielderLong + 'ゴロに封殺';
                    break;
                case 'thrown':
                    statement += fielder + 'ゴロ';
                    break;
            }
        } else {
            fielder = text.fielderShortName(fielder);
            switch (bases) {
                case 1:
                    if (infield) {
                        statement += '内野安打' + '('+fielder+')'+ 'で出塁';
                    } else {
                        statement += '安打('+fielder+')' + 'で出塁';
                    }
                    break;
                case 2:
                    statement += '二塁打（'+fielder+'）で出塁';
                    break;
                case 3:
                    statement += '三塁打（'+fielder+'）で出塁';
                    break;
                case 4:
                    statement += '本塁打（'+fielder+'）';
                    break;
            }
        }
        if (sacrificeAdvances) {
            sacrificeAdvances.map(function(base) {
                if (base == 'third') {
                    statement += stop + 'サードランナーホームイン';
                } else {
                    statement += stop + text(base) + 'ランナー進塁';
                }
            });
        }
        statement += stop;
    }
    return statement;
};

exports.text = text;
exports.mode = mode;