import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Index } from './pages/Index';
import './style.min.css';
import { AuthProvider } from './contexts/AuthContext';

// head情報
const title = '習慣メモ';
const description = 'これはやったことを記録していく習慣メモアプリです。';
document.title = title;
const headData = document.head.children;
for (let i = 0; i < headData.length; i++) {
  const nameVal = headData[i].getAttribute('name');
  if (nameVal !== null) {
    if (nameVal.indexOf('description') !== -1) {
      headData[i].setAttribute('content', description);
    }
    // OGP(twitter)の設定
    if (nameVal.indexOf('twitter:title') !== -1) {
      headData[i].setAttribute('content', title);
    }
    if (nameVal.indexOf('twitter:description') !== -1) {
      headData[i].setAttribute('content', description);
    }
  }
}
// ここまでhead情報

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <AuthProvider>
          <Route exact path="/" component={Index} />
        </AuthProvider>
      </Switch>
    </Router>
  );
}

export default App;
