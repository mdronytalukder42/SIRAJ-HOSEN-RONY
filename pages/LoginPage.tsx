import React, { useState } from 'react';
import { Role } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const logoBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGfUExURQAAANqcRsGgT7yYR7ucSLGSRquNR6aJR6aJR6aJR6WIRqWERJ+DER9JDRw/CxU0CNyjSMGlUrOiTbifS7WgS7GbSrGYSKyRSKqPSKeKR6GHR56FRZ2ERZqDRZiBRZeBRJWARJSAQ5F/QpB+Qot6PId3PId2PIZ2PIV1PIV1O4N0OoNzOn9xOX1wOYFsM3hpH3JmHHFkG29hGG5fF2xeFnFbE3VaE3pbE3xbFHtcEn5cEIBcDoNaD4RZD4laEIlbEYtcEo1eE49fFJFgFZJiFpVkF5hmGZpoGpxqG59tHZ9tHaFuHqNyIKRzIadyIKh1Ia56JKt5I697JbB+J7J/KLWAKbaCK7iELb+IাবলীরKbOULrGUrjEVrXBUK/ASavASajASqi/SaW9SKG6R523RpuzRJixQ5KwQY+uP4yoPoenPIWjNoGgMoCgMoCgM4SjNX+eMHybLXqYLXCWK3GVKnOSKHGSJ2+PHWyOGWuNGGeLFl+JFVyHE1uGEFeFEVSEEFOAEVGAEVCAEFJ/D058Dk17DEs5Ckk3CUIvB0ArBj8oBjwmBjsoBjopBTkoBTgnBTgmBSAgAP///y1a+yYAAAAhdFJOUwABAgMEBQYHCQwPEhQVFxgZGhweHyAiKCkqKywtLi8xMjQ1/bJ3AAAE/UlEQVR4Xu2cW3uqPBCAQ+fGAhAFRUTQo1jwouA13v//3xMt07Z7d5KcmQd9ns/JdJo7d2Z2EwAAAAAAAAAAAAAAAAAAAAA/LkmS5HFJkvyUu5zkeSRpSZI8m+5y2jQ0Q/I4JUlSaZp+l82UJJ/X3bW0L/3oTUn+q45Kkr/m6qY25C+l/yF/yH+R/2p/5C+lP6Z/TP/3V/1p+xP2/yr7F/ZH2H+0P8D+Eftn7C+xf0h/wP4R+4fsB9kfst9gf5T9Q/ZD7I/YD7I/ZD/A/hH7h+wH2R+y32B/lP1D9kPsj9gPsj9kP8D+EfuH7AfZH7LfYH+U/UP2Q+yP2A+yP2Q/wP4R+4fsB9kfst9gf5T9Q/ZD7A+xN7eN9UfYE1s/YJ+S/1l/zP5j+tP+9/Sv/f/R/pf94fpT/wD8M/kP85/yP/Zf3S/zv9p/9T/k/+n/lP9T/hP+0/7j/lf+o/7b/mv+x/zf+w/5T/uf8r/33/M/8p/zP/af8r/33/c/9h/xP/S/4L/uf87/kv+i/6L/ov8R/0X/S/5b/gv+S/5H/kv+5/wP+B/wP+B/yP+Q/yH/Y/7H/I/5H/I/5H/If5D/If9j/sf8j/kf8j/kf8j/kP8h/2P+x/yP+R/yP+R/yH+Q/yH/Y/7H/I/5H/I/5H/If5D/If9j/sf8j/kf8j/kf8j/kP8h/yP+Q/yP+R/yP+R/yP+Q/yH/Y/7H/I/5H/I/5H/If5D/If9j/sf8j/kf8j/kf8j/kP8h/yP+Q/yP+R/yP+R/yP+Q/yH/Y/7H/I/5H/I/5H/If5D/If9j/sf8j/kf8j/kf8j/kP8h/yP+Q/yP+R/yP+R/yP+Q/yH/Y/7H/I/5H/I/5H/If5D/If9j/sf8j/kf8j/kf8j/kP8h/yP+Q/yP+R/yP+R/yP+Q/yH/Y/7H/I/5H/I/5H/If5D/If9j/sf8j/kf8j/kf8j/kP8h/yP+Q/yP+R/yP+R/yP+Q/yH/Y/7H/I/5H/I/5H/If5D/If9j/sf8j/kf8j/kf8j/kP8h/yP+Q/yP+R/yP+R/yP+Q/yH/Y/7H/I/5H/I/5H/If5D/If9j/sf8j/kf8j/kf8j/kP8h/yP+Q/yP+R/yP+R/yP+Q/yH/Y/7H/I/5H/I/5H/If5D/If9j/sf8j/kf8j/kf8j/kP8h/yP+Q/yP+R/yP+R/yP+Q/yH/Y/7H/I/5H/I/5H/If5D/If9j/sf8j/kf8j/kf8j/kP8h/yP+Q/yP+R/yP+R/yP+Q/yH/Y/7H/I/5H/I/5H/If5D/If9j/sf8j/kf8j/kf8j/kP8h/yP+Q/yP+R/yP+R/yP+Q/yH/Y/7H/I/5H/I/5H/If5D/If9j/sf8j/kf8j/kf8j/kP8r/o//D9K/9/9H/lf2h+3P+h/z3/K/1P+U/6r/tP+S/7b/mP+3/yH/K/9z/n/97/mv/J/5D/pf9L/kv+5/wf87/kP+1/wP+B/yv/L/8g/5L/m/8n/y/9T/qv+l/z//H//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADz4P/4M/ANuY37z0+R8aAAAAAElFTkSuQmCC";

const LoginPage: React.FC = () => {
    const [role, setRole] = useState<Role>(Role.Staff);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, user } = useAuth();
    const navigate = useNavigate();

    if (user) {
        const path = user.role === Role.Admin ? '/admin' : '/staff';
        navigate(path, { replace: true });
        return null;
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(username.trim(), password, role);
            // Navigation is handled by the useAuth hook
        } catch (err) {
            setError('Invalid credentials. Please check your username, password, and role.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <img src={logoBase64} alt="AMIN TOUCH Logo" className="mx-auto h-24 w-auto" />
                    <p className="mt-4 text-gray-300">Staff Management & Income Tracking</p>
                </div>
                <div className="bg-gray-800 bg-opacity-75 backdrop-blur-sm shadow-lg rounded-xl p-8 border border-gray-700">
                    <div className="mb-6">
                        <div className="flex border border-gray-600 rounded-lg p-1">
                            <button
                                onClick={() => setRole(Role.Staff)}
                                className={`w-1/2 py-2 rounded-md text-sm font-medium transition-colors ${role === Role.Staff ? 'bg-blue-600 text-white shadow' : 'text-gray-300 hover:bg-gray-700'}`}
                            >
                                Staff Login
                            </button>
                            <button
                                onClick={() => setRole(Role.Admin)}
                                className={`w-1/2 py-2 rounded-md text-sm font-medium transition-colors ${role === Role.Admin ? 'bg-blue-600 text-white shadow' : 'text-gray-300 hover:bg-gray-700'}`}
                            >
                                Admin Login
                            </button>
                        </div>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && <p className="text-red-400 text-center text-sm">{error}</p>}
                        <div>
                            <label htmlFor="username" className="text-sm font-medium text-gray-300">Username</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="mt-1 w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your username"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="text-sm font-medium text-gray-300">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;