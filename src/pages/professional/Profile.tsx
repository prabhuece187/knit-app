import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useGetProfessionalByUserIdQuery } from "./api/ProfessionalApi"
import {
    Linkedin,
    Twitter,
    Facebook,
    Instagram,
    Phone,
    MessageCircle,
    Globe,
    Building2,
    Map,
    Landmark,
    Home,
    Hash,
} from "lucide-react"
import { useAppSelector } from "@/store/Store"

const baseUrl = import.meta.env.VITE_API_URL as string

type ProfileProps = {
    userId?: number
}

export default function Profile({ userId: userIdFromProps }: ProfileProps) {

    const authUserId = useAppSelector((state) => state.auth.user?.id)
    const resolvedUserId = userIdFromProps ?? authUserId
    const skipFetch =
        resolvedUserId == null ||
        typeof resolvedUserId !== "number" ||
        Number.isNaN(resolvedUserId)

    const { data, isLoading, isError } = useGetProfessionalByUserIdQuery(
        resolvedUserId ?? 0,
        { skip: skipFetch },
    )

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (isError || !data) return null

    const socials = [
        { icon: Linkedin, label: "LinkedIn", url: data.linkedInProfile },
        { icon: Twitter, label: "Twitter / X", url: data.twitterProfile },
        { icon: Facebook, label: "Facebook", url: data.facebookProfile },
        { icon: Instagram, label: "Instagram", url: data.instagramProfile },
    ].filter((s) => s.url)

    const contactItems = [
        { icon: Phone, label: data.mobileNumber },
        { icon: MessageCircle, label: data.whatsappNumber },
        {
            icon: Globe,
            label: data.officeWebsite?.replace(/^https?:\/\//, ""),
            href: data.officeWebsite,
        },
    ].filter((c) => c.label)

    const locationItems = [
        { icon: Building2, label: data.country },
        { icon: Map, label: data.state?.name },
        { icon: Landmark, label: data.district?.name },
        { icon: Home, label: data.city?.name },
    ].filter((l) => l.label)

    return (
        <div className="flex justify-center">
            <div className="max-w-2xl font-sans">

                {/* ── HERO HEADER ── */}
                <div className="relative bg-zinc-900 overflow-hidden">
                    {/* Yellow accent strip */}
                    <div className="absolute top-0 right-0 w-2/5 h-full bg-amber-400" />

                    <div className="relative z-10 flex items-stretch min-h-[200px]">
                        {/* Left: text info */}
                        <div className="flex-1 px-8 py-8 flex flex-col justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-white tracking-tight leading-tight">
                                    {data.name}
                                </h1>
                                <div className="w-10 h-0.5 bg-amber-400 mt-2 mb-3" />
                                <p className="text-amber-400 text-xs font-semibold uppercase tracking-[0.15em]">
                                    {data.category?.name} · {data.subCategory?.name}
                                </p>
                            </div>

                            <div className="mt-6 space-y-1.5">
                                {contactItems.map(({ icon: Icon, label, href }) => (
                                    <div key={label} className="flex items-center gap-2">
                                        <Icon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                        {href ? (
                                            <a
                                                href={href}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-zinc-300 text-sm hover:text-white transition-colors truncate max-w-[220px]"
                                            >
                                                {label}
                                            </a>
                                        ) : (
                                            <span className="text-zinc-300 text-sm">{label}</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Social icons */}
                            <div className="flex gap-3 mt-5">
                                {socials.map(({ icon: Icon, label, url }) => (
                                    <a
                                        key={label}
                                        href={url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-zinc-400 hover:text-amber-400 transition-colors"
                                        title={label}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Right: avatar on yellow */}
                        <div className="w-2/5 flex items-end justify-center pt-4 px-4">
                            <Avatar className="w-36 h-36 rounded-none shadow-xl border-0">
                                <AvatarImage
                                    src={`${baseUrl}/${data.profileImage}`}
                                    alt={data.name}
                                    className="object-cover object-top"
                                />
                                <AvatarFallback className="text-4xl font-bold bg-amber-300 text-zinc-900 rounded-none">
                                    {data.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </div>

                <Separator className="my-4" />

                <div className="mx-6">

                    {/* ── LOCATION SECTION ── */}
                    <SectionBlock label="Location">
                        <div className="grid grid-cols-2 gap-x-8 gap-y-0">
                            {locationItems.map(({ icon: Icon, label }) => (
                                <div
                                    key={label}
                                    className="flex items-center gap-3 py-3 border-b border-zinc-100 last:border-0"
                                >
                                    <Icon className="w-4 h-4 text-zinc-400 shrink-0" />
                                    <span className="text-sm font-medium text-zinc-800">{label}</span>
                                </div>
                            ))}
                        </div>
                    </SectionBlock>

                    <Separator className="my-4" />


                    {/* ── PINCODES SECTION ── */}
                    {data?.pincodes?.length && data?.pincodes?.length > 0 && (

                        <div className="flex border-b border-zinc-200 last:border-0 mb-5 items-center">
                            {/* Rotated label tab */}
                            <div className="w-12 shrink-0 bg-zinc-900 flex items-center justify-center">
                                <span
                                    className="text-white text-[10px] font-bold uppercase tracking-[0.18em] whitespace-nowrap p-8"
                                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                                >
                                    Pincodes
                                </span>
                            </div>
                            {/* Content area */}
                            <div className="flex-1 bg-zinc-50 px-6 py-4">
                                <div className="flex flex-wrap gap-2">
                                    {data?.pincodes?.map((pin: string) => (
                                        <span
                                            key={pin}
                                            className="inline-flex items-center gap-1.5 border border-zinc-200 rounded-sm px-3 py-1.5 text-xs font-semibold text-zinc-700 bg-white"
                                        >
                                            <Hash className="w-3 h-3 text-zinc-400" />
                                            {pin}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <Separator className="my-4" />

                    {/* ── SOCIAL SECTION ── */}
                    <SectionBlock label="Social">
                        <div className="space-y-0">
                            {socials.map(({ icon: Icon, label, url }) => (
                                <div
                                    key={label}
                                    className="flex items-center justify-between py-3 border-b border-zinc-100 last:border-0"
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className="w-4 h-4 text-zinc-400" />
                                        <span className="text-sm font-semibold text-zinc-900">{label}</span>
                                    </div>
                                    <a
                                        href={url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-zinc-400 hover:text-amber-500 transition-colors truncate max-w-[200px]"
                                    >
                                        {url?.replace(/^https?:\/\//, "")}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </SectionBlock>

                </div>


            </div>
        </div>
    )
}

/* Section block with rotated label — matches the resume image style */
function SectionBlock({
    label,
    children,
}: {
    label: string
    children: React.ReactNode
}) {
    return (
        <div className="flex border-b border-zinc-200 last:border-0">
            {/* Rotated label tab */}
            <div className="w-12 shrink-0 bg-zinc-900 flex items-center justify-center">
                <span
                    className="text-white text-[10px] font-bold uppercase tracking-[0.18em] whitespace-nowrap"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                >
                    {label}
                </span>
            </div>
            {/* Content area */}
            <div className="flex-1 bg-zinc-50 px-6 py-4">{children}</div>
        </div>
    )
}