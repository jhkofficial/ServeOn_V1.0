import React, { useState, useEffect } from 'react';
import { PlatformUser, UserRole, UserStatus } from '../../types';
import { SERVEON_REGIONS } from '../../data/governanceData';
import {
  X,
  User,
  Mail,
  Briefcase,
  Building,
  Shield,
  MapPin,
  Check,
  AlertCircle,
  Trash2,
  Lock,
} from 'lucide-react';

interface UserDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: PlatformUser | null;
  onSaveUser: (user: PlatformUser) => void;
  onDeactivateUser?: (userId: string) => void;
}

export const UserDrawerModal: React.FC<UserDrawerModalProps> = ({
  isOpen,
  onClose,
  userToEdit,
  onSaveUser,
  onDeactivateUser,
}) => {
  const isEdit = Boolean(userToEdit);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [businessUnit, setBusinessUnit] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [role, setRole] = useState<UserRole>('Viewer');
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['All Regions']);
  const [kabupatenAccess, setKabupatenAccess] = useState('');
  const [status, setStatus] = useState<UserStatus>('Active');

  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name);
      setEmail(userToEdit.email);
      setEmployeeId(userToEdit.employeeId);
      setBusinessUnit(userToEdit.businessUnit);
      setJobTitle(userToEdit.jobTitle);
      setRole(userToEdit.role);
      setSelectedRegions(userToEdit.regionAccess.length > 0 ? userToEdit.regionAccess : ['All Regions']);
      setKabupatenAccess(userToEdit.kabupatenAccess ? userToEdit.kabupatenAccess.join(', ') : '');
      setStatus(userToEdit.status);
    } else {
      setName('');
      setEmail('');
      setEmployeeId(`EMP-${Math.floor(10000 + Math.random() * 90000).toString().slice(0, 5)}`);
      setBusinessUnit('Regional Strategy & Operations');
      setJobTitle('');
      setRole('Regional Manager');
      setSelectedRegions(['Jawa Tengah']);
      setKabupatenAccess('Kota Semarang');
      setStatus('Active');
    }
  }, [userToEdit, isOpen]);

  if (!isOpen) return null;

  const handleToggleRegion = (reg: string) => {
    if (reg === 'All Regions') {
      setSelectedRegions(['All Regions']);
      return;
    }

    let next = selectedRegions.filter((r) => r !== 'All Regions');
    if (next.includes(reg)) {
      next = next.filter((r) => r !== reg);
    } else {
      next.push(reg);
    }

    if (next.length === 0) {
      next = ['All Regions'];
    }
    setSelectedRegions(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const kabArray = kabupatenAccess
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    const saved: PlatformUser = {
      id: userToEdit ? userToEdit.id : `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      employeeId: employeeId.trim() || 'EMP-00999',
      businessUnit: businessUnit.trim() || 'Operations',
      jobTitle: jobTitle.trim() || 'Staff',
      role,
      regionAccess: selectedRegions,
      kabupatenAccess: kabArray.length > 0 ? kabArray : undefined,
      lastLogin: userToEdit ? userToEdit.lastLogin : 'Never',
      status,
      avatarInitials: initials || 'US',
      department: businessUnit,
      createdAt: userToEdit?.createdAt || '15 Sep 2026',
    };

    onSaveUser(saved);
    onClose();
  };

  const ROLES_LIST: UserRole[] = [
    'Super Admin',
    'Application Admin',
    'Executive / Management',
    'Regional Manager',
    'Network Planning',
    'CRM / Marketing',
    'Data Analyst',
    'Viewer',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Slide-over Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-blue-700 tracking-wider uppercase font-mono">
                  {isEdit ? 'EDIT USER ACCOUNT' : 'NEW USER PROVISIONING'}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                {isEdit ? `Edit User: ${userToEdit?.name}` : 'Add New User'}
              </h2>
              <p className="text-xs text-slate-500">
                Configure user identity, corporate authorization role, and regional scope.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body Form */}
          <form onSubmit={handleSubmit} id="user-form" className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
            {/* SECTION 1: USER INFORMATION */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
                <User className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  USER INFORMATION
                </h3>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Johanes Harindrias"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Corporate Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder="EMP-00184"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Business Unit
                  </label>
                  <input
                    type="text"
                    value={businessUnit}
                    onChange={(e) => setBusinessUnit(e.target.value)}
                    placeholder="Regional Strategy & Planning"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Regional Strategy Lead"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>
            </div>

            {/* SECTION 2: ACCESS CONTROL */}
            <div className="space-y-3.5 pt-2 border-t border-slate-200">
              <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
                <Shield className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  ACCESS CONTROL
                </h3>
              </div>

              {/* Role */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  SERVEON Role <span className="text-rose-500">*</span>
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                >
                  {ROLES_LIST.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Determines functional permissions across Strategic Map, Retention, Defense, Expansion, and Governance.
                </p>
              </div>

              {/* Region Access */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-semibold text-slate-700">
                    Region Access (Provinsi)
                  </label>
                  <span className="text-[10px] text-slate-500">
                    {selectedRegions.includes('All Regions')
                      ? 'Unrestricted'
                      : `${selectedRegions.length} Selected`}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 max-h-36 overflow-y-auto space-y-1.5">
                  {SERVEON_REGIONS.map((reg) => {
                    const isChecked = selectedRegions.includes(reg);
                    return (
                      <label
                        key={reg}
                        className={`flex items-center justify-between px-2.5 py-1 rounded cursor-pointer transition-colors ${
                          isChecked ? 'bg-blue-50 text-blue-900 font-semibold' : 'hover:bg-white text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleRegion(reg)}
                            className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 border-slate-300"
                          />
                          <span>{reg}</span>
                        </div>
                        {reg === 'Jawa Tengah' && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-medium">
                            Pilot Area
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Kabupaten / Kota Access */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kabupaten / Kota Access (Comma-separated)
                </label>
                <input
                  type="text"
                  value={kabupatenAccess}
                  onChange={(e) => setKabupatenAccess(e.target.value)}
                  placeholder="e.g. Kota Semarang, Kab. Semarang, Kab. Kendal"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
                <p className="text-[10.5px] text-slate-400 mt-1">
                  Leave blank for unrestricted coverage within assigned province.
                </p>
              </div>

              {/* Account Status */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Account Status
                </label>
                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                    <input
                      type="radio"
                      name="status"
                      value="Active"
                      checked={status === 'Active'}
                      onChange={() => setStatus('Active')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                    <input
                      type="radio"
                      name="status"
                      value="Inactive"
                      checked={status === 'Inactive'}
                      onChange={() => setStatus('Inactive')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-slate-400" />
                      Inactive
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </form>

          {/* Drawer Footer Actions */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            {isEdit && onDeactivateUser && userToEdit ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Deactivate user account for ${userToEdit.name}?`)) {
                    onDeactivateUser(userToEdit.id);
                    onClose();
                  }
                }}
                className="px-3 py-2 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Deactivate User</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                form="user-form"
                className="px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs tracking-wider transition-colors shadow-xs"
              >
                {isEdit ? 'Save Changes' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
