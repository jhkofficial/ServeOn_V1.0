import React, { useState } from 'react';
import { ApplicationSettingsConfig } from '../../types';
import { INITIAL_APPLICATION_SETTINGS, SERVEON_REGIONS } from '../../data/governanceData';
import {
  Sliders,
  Shield,
  Database,
  Cpu,
  Save,
  CheckCircle2,
  Clock,
  KeyRound,
  FileCheck,
  AlertCircle,
  Building,
} from 'lucide-react';

export const ScreenApplicationSettings: React.FC = () => {
  const [settings, setSettings] = useState<ApplicationSettingsConfig>(INITIAL_APPLICATION_SETTINGS);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">
              SCREEN • GOVERNANCE
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              System Parameters
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Application Settings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure platform parameters, decision engine framework version, and enterprise security controls.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Settings Saved Successfully</span>
            </div>
          )}

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-xs flex items-center gap-1.5 active:scale-[0.99] cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 1: GENERAL SETTINGS */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Building className="w-4 h-4 text-blue-600" />
            <h2 className="font-bold text-slate-900 text-xs tracking-wider uppercase font-mono">
              GENERAL SETTINGS
            </h2>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Application Name
              </label>
              <input
                type="text"
                value={settings.general.applicationName}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    general: { ...settings.general, applicationName: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Environment
              </label>
              <select
                value={settings.general.environment}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    general: {
                      ...settings.general,
                      environment: e.target.value as any,
                    },
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden cursor-pointer"
              >
                <option value="Pilot">Pilot (Semarang Target)</option>
                <option value="Production">Production (National)</option>
                <option value="Staging">Staging</option>
                <option value="Development">Development</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Default Region
              </label>
              <select
                value={settings.general.defaultRegion}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    general: { ...settings.general, defaultRegion: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden cursor-pointer"
              >
                {SERVEON_REGIONS.filter((r) => r !== 'All Regions').map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Default Period
              </label>
              <input
                type="text"
                value={settings.general.defaultPeriod}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    general: { ...settings.general, defaultPeriod: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: DECISION INTELLIGENCE */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Cpu className="w-4 h-4 text-blue-600" />
            <h2 className="font-bold text-slate-900 text-xs tracking-wider uppercase font-mono">
              DECISION INTELLIGENCE
            </h2>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Framework Version
              </label>
              <div className="px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 font-bold font-mono flex items-center justify-between">
                <span>{settings.decisionIntelligence.frameworkVersion}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold font-sans">
                  Active
                </span>
              </div>
              <p className="text-[10.5px] text-slate-500 mt-1">
                Includes TOPSIS multi-criteria synthesis, AHP pairwise weighting, and expansion gating.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Recommendation Approval
              </label>
              <select
                value={settings.decisionIntelligence.recommendationApproval}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    decisionIntelligence: {
                      ...settings.decisionIntelligence,
                      recommendationApproval: e.target.value as any,
                    },
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden cursor-pointer"
              >
                <option value="Human Approval Required">Human Approval Required (Human-in-the-Loop)</option>
                <option value="Dual Sign-off">Dual Sign-off (Regional + Executive)</option>
                <option value="Autonomous Mode">Autonomous Mode (Direct Campaign Dispatch)</option>
              </select>
              <p className="text-[10.5px] text-slate-500 mt-1">
                Enforces executive authorization before operational campaign activation.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Evidence Confidence Display
              </label>
              <select
                value={settings.decisionIntelligence.evidenceConfidenceDisplay}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    decisionIntelligence: {
                      ...settings.decisionIntelligence,
                      evidenceConfidenceDisplay: e.target.value as any,
                    },
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden cursor-pointer"
              >
                <option value="Enabled">Enabled (Show SHAP, AHP CR &amp; Data Quality scores)</option>
                <option value="Disabled">Disabled (Simplified view)</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 3: DATA */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Database className="w-4 h-4 text-blue-600" />
            <h2 className="font-bold text-slate-900 text-xs tracking-wider uppercase font-mono">
              DATA
            </h2>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Latest Data Refresh
              </label>
              <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 font-mono">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{settings.data.latestDataRefresh}</span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Data Status
              </label>
              <div className="flex items-center gap-2 px-3 py-2 border border-emerald-200 rounded-lg bg-emerald-50 text-emerald-800 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{settings.data.dataStatus} (All 16 Semarang Districts &amp; H3 Hexagons Verified)</span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Refresh Cadence
              </label>
              <input
                type="text"
                readOnly
                value={settings.data.refreshCadence}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-xs text-slate-600 font-mono"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: SECURITY */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <KeyRound className="w-4 h-4 text-blue-600" />
            <h2 className="font-bold text-slate-900 text-xs tracking-wider uppercase font-mono">
              SECURITY
            </h2>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Authentication Method
              </label>
              <select
                value={settings.security.authenticationMethod}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    security: {
                      ...settings.security,
                      authenticationMethod: e.target.value as any,
                    },
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden cursor-pointer"
              >
                <option value="Corporate SSO">Corporate SSO (SAML 2.0 / OIDC with Azure AD)</option>
                <option value="MFA + Corporate Password">MFA + Corporate Password</option>
                <option value="LDAP/AD">LDAP / Active Directory Bind</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Session Timeout
              </label>
              <select
                value={settings.security.sessionTimeout}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    security: {
                      ...settings.security,
                      sessionTimeout: e.target.value as any,
                    },
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden cursor-pointer"
              >
                <option value="15 minutes">15 minutes</option>
                <option value="30 minutes">30 minutes (Corporate Standard)</option>
                <option value="60 minutes">60 minutes</option>
                <option value="8 hours">8 hours (Full Shift)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Audit Logging
              </label>
              <div className="flex items-center gap-2 px-3 py-2 border border-blue-200 rounded-lg bg-blue-50 text-blue-900 font-semibold">
                <FileCheck className="w-4 h-4 text-blue-700" />
                <span>{settings.security.auditLogging} (Immutable Tamper-Proof Audit Trail)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
