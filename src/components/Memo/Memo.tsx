import { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { SignInBtn, SignOutBtn } from '../Auth/Auth';

type MemoTypes = {
    id: string;
    text: string;
    date: string; // YYYY-MM-DD
    createdAt?: any;
};

export const Memo = () => {
    const [text, setText] = useState('');
    const [memos, setMemos] = useState<MemoTypes[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState('');

    const user = useAuth();
    const isAuth = !!user;

    // const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    // const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));

    // 現在の年月を取得
    const now = new Date();
    const currentYear = now.getFullYear().toString();
    const currentMonth = String(now.getMonth() + 1).padStart(2, '0'); // 1月 → "01"

    // state 初期値にセット
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);

    const memosRef = collection(db, 'memos');

    const fetchMemos = async () => {
        const q = query(memosRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(doc => ({
            id: doc.id,
            text: doc.data().text,
            date: doc.data().date,
            createdAt: doc.data().createdAt,
        }));
        setMemos(list);
    };

    const addMemo = async () => {
        if (!text) return;

        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        await addDoc(memosRef, {
            text,
            date: todayStr,
            createdAt: serverTimestamp(),
        });

        setText('');
        fetchMemos();
    };

    const startEdit = (memo: MemoTypes) => {
        setEditingId(memo.id);
        setEditingText(memo.text);
    };

    const updateMemo = async (id: string) => {
        if (!editingText) return;

        const memoDoc = doc(db, 'memos', id);
        await updateDoc(memoDoc, {
            text: editingText,
        });

        setEditingId(null);
        setEditingText('');
        fetchMemos();
    };

    const deleteMemo = async (id: string) => {
        const memoDoc = doc(db, 'memos', id);
        await deleteDoc(memoDoc);
        fetchMemos();
    };


    useEffect(() => {
        fetchMemos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 日付ごとにグループ化
    const groupedMemos = memos.reduce<Record<string, MemoTypes[]>>(
        (acc, memo) => {
            // フィルタ: 選択された西暦・月だけを集約
            const [year, month] = memo.date.split('-');
            if (year === selectedYear && month === selectedMonth) {
                if (!acc[memo.date]) acc[memo.date] = [];
                acc[memo.date].push(memo);
            }
            return acc;
        },
        {}
    );

    // セレクトボックス用の年・月配列
    const years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - i).toString());
    const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

    return (
        <section className="memo">
            <div className="title">
                <h1>習慣メモ</h1>
                {isAuth ? (<SignOutBtn />) : (<SignInBtn />)}

                {/* セレクトボックス */}
                <div className="filters">
                    <select className="y-select" value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
                        {years.map(y => <option key={y} value={y}>{y}年</option>)}
                    </select>
                    <select className="m-select" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
                        {months.map(m => <option key={m} value={m}>{m}月</option>)}
                    </select>
                </div>
            </div>

            {Object.keys(groupedMemos).length === 0 ? (
                <div className="post-wrap">
                    <p>該当メモがありません</p>
                </div>
            ) : (
                Object.entries(groupedMemos).map(([date, memos]) => (
                    <div className="post-wrap" key={date}>
                        <h3>{date}</h3>
                        <ul className="posts">
                            {memos.map((memo) => (
                                <li className="post" key={memo.id}>
                                    {editingId === memo.id ? (
                                        <div className="inner-post">
                                            <input
                                                className="edit-text"
                                                value={editingText}
                                                onChange={(e) => setEditingText(e.target.value)}
                                            />
                                            <div className="btn-wrapper">
                                                <button className="edit-btn" onClick={() => setEditingId(null)}>キャンセル</button>
                                                <button className="edit-btn" onClick={() => updateMemo(memo.id)}>保存</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="inner-post">
                                            <div
                                                className="post-text"
                                                dangerouslySetInnerHTML={{ __html: memo.text }}
                                            />
                                            {isAuth && (
                                                <div className="btn-wrapper">
                                                    <button className="edit-btn" onClick={() => startEdit(memo)}>編集</button>
                                                    <button className="edit-btn" onClick={() => deleteMemo(memo.id)}>削除</button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}

            {isAuth && (
                <div className="form">
                    <input
                        className="input-text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="やったこと、学び、気づき等入力"
                    />
                    <button
                        className="input-btn"
                        onClick={addMemo}>
                        +
                    </button>
                </div>
            )}
        </section>
    );
};
