import React from 'react';
import { Palette, Linkedin, Twitter, Instagram, Github, Globe, Briefcase, GraduationCap } from 'lucide-react';

interface UserProfileInfoProps {
    displayUser: any;
    isOwnProfile: boolean;
}

export const UserProfileInfo: React.FC<UserProfileInfoProps> = ({ displayUser, isOwnProfile }) => {
    const aboutText = displayUser.bio || "¡Hola! Soy un miembro de la comunidad creativa.";
    const socialLinks = displayUser.socialLinks || {};
    const skills = displayUser.skills || [];
    const experienceList = displayUser.experience || [];
    const educationList = displayUser.education || [];

    return (
        <div className="space-y-10">
            {/* About */}
            <div>
                <h3 className="text-base font-bold text-white uppercase tracking-widest mb-4">Sobre mí</h3>
                <p className="text-base 2xl:text-lg text-slate-400 leading-relaxed mb-6">
                    {aboutText}
                </p>
                <div className="flex gap-3 flex-wrap">
                    {(() => {
                        const getSocialUrl = (baseUrl: string, handle: string) => {
                            if (!handle) return '';
                            if (handle.startsWith('http://') || handle.startsWith('https://')) return handle;
                            return `${baseUrl}${handle.replace(/^@/, '')}`;
                        };

                        return (
                            <>
                                {socialLinks.artstation && (
                                    <a href={getSocialUrl('https://artstation.com/', socialLinks.artstation)} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-[#13AFF0] hover:bg-[#13AFF0]/10 transition-colors" title="ArtStation">
                                        <Palette className="h-5 w-5" />
                                    </a>
                                )}
                                {socialLinks.linkedin && (
                                    <a href={getSocialUrl('https://linkedin.com/in/', socialLinks.linkedin)} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-[#0A66C2] hover:bg-[#0A66C2]/10 transition-colors" title="LinkedIn">
                                        <Linkedin className="h-5 w-5" />
                                    </a>
                                )}
                                {socialLinks.twitter && (
                                    <a href={getSocialUrl('https://twitter.com/', socialLinks.twitter)} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10 transition-colors" title="Twitter">
                                        <Twitter className="h-5 w-5" />
                                    </a>
                                )}
                                {socialLinks.instagram && (
                                    <a href={getSocialUrl('https://instagram.com/', socialLinks.instagram)} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-[#E4405F] hover:bg-[#E4405F]/10 transition-colors" title="Instagram">
                                        <Instagram className="h-5 w-5" />
                                    </a>
                                )}
                                {socialLinks.github && (
                                    <a href={getSocialUrl('https://github.com/', socialLinks.github)} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors" title="GitHub">
                                        <Github className="h-5 w-5" />
                                    </a>
                                )}
                                {socialLinks.website && (
                                    <a href={socialLinks.website.startsWith('http') ? socialLinks.website : `https://${socialLinks.website}`} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 transition-colors" title="Website">
                                        <Globe className="h-5 w-5" />
                                    </a>
                                )}
                            </>
                        );
                    })()}

                    {/* Show defaults if no links and it's own profile */}
                    {isOwnProfile && Object.values(socialLinks).every(v => !v) && (
                        <p className="text-sm text-slate-500 italic">No has añadido redes sociales.</p>
                    )}
                </div>

                {/* Skills Section */}
                {skills.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-white/5">
                        <h3 className="text-base font-bold text-white uppercase tracking-widest mb-4">Habilidades</h3>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill: string) => (
                                <span key={skill} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-slate-300 text-sm font-medium hover:border-amber-500/30 transition-colors">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Experience Section */}
            <div className="pt-8 border-t border-white/5">
                <h3 className="text-base font-bold text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-amber-500" /> Experiencia
                </h3>
                <div className="space-y-10 relative border-l border-white/10 ml-2 pl-8">
                    {experienceList.length > 0 ? experienceList.map((job: any) => (
                        <div key={job.id} className="relative">
                            <div className="absolute -left-[37px] top-1.5 h-3 w-3 rounded-full bg-[#0d0d0f] border-2 border-amber-500"></div>

                            <h4 className="text-lg 2xl:text-xl font-bold text-white leading-tight mb-1">{job.role}</h4>
                            <div className="text-sm 2xl:text-base text-amber-500 font-medium mb-1">{job.company}</div>
                            <div className="text-xs text-slate-500 mb-3 uppercase tracking-wide">{job.period} • {job.location}</div>

                            <p className="text-sm 2xl:text-base text-slate-400 leading-relaxed">
                                {job.description}
                            </p>
                        </div>
                    )) : (
                        <div className="text-sm text-slate-600 italic">No hay experiencia registrada aún.</div>
                    )}
                </div>
            </div>

            {/* Education Section */}
            <div className="pt-8 border-t border-white/5 mt-8">
                <h3 className="text-base font-bold text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-blue-500" /> Educación
                </h3>
                <div className="space-y-10 relative border-l border-white/10 ml-2 pl-8">
                    {educationList.length > 0 ? educationList.map((edu: any) => (
                        <div key={edu.id} className="relative">
                            <div className="absolute -left-[37px] top-1.5 h-3 w-3 rounded-full bg-[#0d0d0f] border-2 border-blue-500"></div>

                            <h4 className="text-lg 2xl:text-xl font-bold text-white leading-tight mb-1">{edu.degree}</h4>
                            <div className="text-sm 2xl:text-base text-blue-400 font-medium mb-1">{edu.school}</div>
                            <div className="text-xs text-slate-500 mb-2 uppercase tracking-wide">{edu.period}</div>
                            <p className="text-sm 2xl:text-base text-slate-400 leading-relaxed">
                                {edu.description}
                            </p>
                        </div>
                    )) : (
                        <div className="text-sm text-slate-600 italic">No hay educación registrada aún.</div>
                    )}
                </div>
            </div>
        </div>
    );
};
