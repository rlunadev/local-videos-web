import './Header.css';

interface HeaderProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

export function Header({ searchTerm, onSearchChange }: HeaderProps) {
    return (
        <div className="topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                <div className="logo">CLOUD</div>
                <div style={{ color: '#9fb2c9' }}>AWS Certified Cloud Practitioner</div>
            </div>

            <div className="nav-actions">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Buscar videos, módulos..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
                <div className="profile">RL</div>
            </div>
        </div>
    );
}
