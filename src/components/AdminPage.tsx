import { useState, useEffect } from 'react';
import type { XUser } from '../types';
import {
  supabase, signIn, signOut,
  fetchXUsers, addXUser, updateXUser, deleteXUser,
} from '../lib/supabase';

const inputCls = 'w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-colors';
const btnPrimary = 'h-10 px-4 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors';
const btnGhost = 'h-9 px-3 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-gray-50 transition-colors';
const btnSm = 'h-7 px-2.5 rounded-md border border-slate-200 text-xs text-slate-600 hover:bg-gray-50 transition-colors';
const btnDanger = 'h-7 px-2.5 rounded-md border border-red-200 text-xs text-red-600 hover:bg-red-50 transition-colors';

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
    <div className="max-w-sm mx-auto mt-16">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-6 text-center">管理画面</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
            required
          />
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputCls}
            required
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button type="submit" className={`${btnPrimary} w-full mt-1`} disabled={loading}>
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>
      </div>
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
    <tr className={`border-t border-slate-100 ${!user.enabled ? 'opacity-50' : ''}`}>
      <td className="px-4 py-3 text-sm text-slate-700">
        <span className="font-mono">@{user.username}</span>
      </td>
      <td className="px-4 py-3 text-sm">
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="px-2 py-1 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 w-40"
              onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
              autoFocus
            />
            <button onClick={handleNameSave} className={btnSm}>保存</button>
            <button onClick={() => setEditing(false)} className={btnSm}>×</button>
          </div>
        ) : (
          <span
            className="cursor-pointer text-slate-700 hover:text-primary-600"
            onClick={() => setEditing(true)}
          >
            {user.displayName || <span className="text-slate-400 text-xs">クリックして入力</span>}
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-center">
        <button
          className={`h-7 px-3 rounded-full text-xs font-medium border transition-colors ${
            user.enabled
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
          }`}
          onClick={() => onToggle(user.id, !user.enabled)}
        >
          {user.enabled ? '有効' : '無効'}
        </button>
      </td>
      <td className="px-4 py-3 text-center">
        <button
          className={btnDanger}
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
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-semibold text-slate-900">X ユーザー管理</h2>
        <button onClick={() => signOut()} className={btnGhost}>ログアウト</button>
      </div>

      <form onSubmit={handleAdd} className="flex items-start gap-3 mb-6">
        <div className="flex-1">
          <input
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="@username"
            className={inputCls}
          />
          {addError && <p className="mt-1 text-xs text-red-600">{addError}</p>}
        </div>
        <button type="submit" className={btnPrimary} disabled={adding}>
          {adding ? '追加中...' : '追加'}
        </button>
      </form>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">ユーザー名</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">表示名</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">状態</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={4} className="px-4 py-8 text-sm text-slate-400 text-center">読み込み中...</td></tr>
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

  if (authed === null) return <div className="text-sm text-slate-400 text-center py-16">確認中...</div>;
  return authed ? <AdminDashboard /> : <LoginForm />;
}
