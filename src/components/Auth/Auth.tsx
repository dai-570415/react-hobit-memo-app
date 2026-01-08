import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider } from '../../firebase';
import { useHistory } from 'react-router-dom';

export const SignInBtn = () => {
    const history = useHistory();

    const handleSignIn = async () => {
        await signInWithPopup(auth, provider);
        history.push('/'); // ← indexへ
    };

    return (
        <button onClick={handleSignIn}>
            Googleログイン
        </button>
    );
};

export const SignOutBtn = () => {
    const history = useHistory();

    const handleSignOut = async () => {
        await signOut(auth);
        history.push(''); // or '/signin' にしてもOK
    };
    return (
        <button onClick={handleSignOut}>
            ログアウト
        </button>
    );
};
