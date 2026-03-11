import { useState, useEffect } from 'react';
import type { XUser } from '../types';
import {
  supabase, signIn, signOut,
  fetchXUsers, addXUser, updateXUser, deleteXUser,
} from '../lib/supabase';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: err } = await signIn(email, password);
    if (err) setError(err.message);
    setLoading(false);
  };

  return (
    <div className="admin-login">
      <h2 className="admin-login-title">管理画面</h2>
      <form onSubmit={handleSubmit} className="admin-login-form">
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="admin-input"
          required
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="admin-input"
          required
        />
        {error && <p className="admin-error">{error}</p>}
        <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
          {loading ? 'ログイン中...' : 'ログイン'}
        </button>
      </form>
    </div>
  );
}

function UserRow({ user, onToggle, onDelete, onNameUpdate }: {
  user: XUser;
  onToggle: (id: string, enabled: boolean) => void;
  onDelete: (id: string) => void;
  onNameUpdate: (id: string, name: string) => void;
}) {
  const [editName, setEditName] = useState(user.displayName ?? '');
  const [editing, setEditing] = useState(false);

  const handleNameSave = () => {
    onNameUpdate(user.id, editName);
    setEditing(false);
  };

  return (
    <tr className={`admin-user-row ${!user.enabled ? 'admin-user-disabled' : ''}`}>
      <td className="admin-td">
        <span className="admin-username">@{user.username}</span>
      </td>
      <td className="admin-td">
        {editing ? (
          <div className="admin-name-edit">
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="admin-input admin-input-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
              autoFocus
            />
            <button onClick={handleNameSave} className="admin-btn admin-btn-sm">保存</button>
            <button onClick={() => setEditing(false)} className="admin-btn admin-btn-sm admin-btn-ghost">×</button>
          </div>
        ) : (
          <span className="admin-display-name" onClick={() => setEditing(true)}>
            {user.displayName || <span className="admin-placeholder">クリックして入力</span>}
          </span>
        )}
      </td>
      <td className="admin-td admin-td-center">
        <button
          className={`admin-toggle ${user.enabled ? 'admin-toggle-on' : 'admin-toggle-off'}`}
          onClick={() => onToggle(user.id, !user.enabled)}
        >
          {user.enabled ? '有効' : '無効'}
        </button>
      </td>
      <td className="admin-td admin-td-center">
        <button
          className="admin-btn admin-btn-danger admin-btn-sm"
          onClick={() => confirm(`@${user.username} を削除しますか？`) && onDelete(user.id)}
        >
          削除
        </button>
      </td>
    </tr>
  );
}

function AdminDashboard() {
  const [users, setUsers] = useState<XUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUsername, setNewUsername] = useState('');
  const [addError, setAddError] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchXUsers().then(setUsers).finally(() => setLoading(false));
  }, []);

  const handleToggle = async (id: string, enabled: boolean) => {
    await updateXUser(id, { enabled });
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, enabled } : u));
  };

  const handleDelete = async (id: string) => {
    await deleteXUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const handleNameUpdate = async (id: string, displayName: string) => {
    await updateXUser(id, { displayName });
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, displayName } : u));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const username = newUsername.replace(/^@/, '').trim();
    if (!username) return;
    setAdding(true);
    setAddError('');
    const { error } = await addXUser(username);
    if (error) {
      setAddError(error.includes('duplicate') ? 'すでに登録済みです' : error);
    } else {
      const updated = await fetchXUsers();
      setUsers(updated);
      setNewUsername('');
    }
    setAdding(false);
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2 className="admin-title">X ユーザー管理</h2>
        <button onClick={() => signOut()} className="admin-btn admin-btn-ghost">ログアウト</button>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="admin-th">ユーザー名</th>
              <th className="admin-th">表示名</th>
              <th className="admin-th admin-td-center">状態</th>
              <th className="admin-th admin-td-center">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={4} className="admin-td" style={{ textAlign: 'center' }}>読み込み中...</td></tr>
            )}
            {users.map((u) => (
              <UserRow
                key={u.id}
                user={u}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onNameUpdate={handleNameUpdate}
              />
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={handleAdd} className="admin-add-form">
        <input
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          placeholder="@username"
          className="admin-input"
        />
        <button type="submit" className="admin-btn admin-btn-primary" disabled={adding}>
          {adding ? '追加中...' : '追加'}
        </button>
        {addError && <p className="admin-error">{addError}</p>}
      </form>
    </div>
  );
}

export function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuthed(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (authed === null) return <div className="state-message">確認中...</div>;
  return authed ? <AdminDashboard /> : <LoginForm />;
}
