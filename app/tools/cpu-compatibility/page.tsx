import { SITE_URL_RESOLVED } from '@/lib/site';
import type {Metadata} from 'next';
import data from '@/content/decision-tool-data.json';
import Compatibility from './Compatibility';
export const metadata:Metadata={title:'CPU compatibility checker',description:'Check manufacturer-listed CPU and motherboard support.',alternates:{canonical:`${SITE_URL_RESOLVED}/tools/cpu-compatibility`},robots:{index:false,follow:true,googleBot:{index:false,follow:true}}};
export default function Page(){return <main className="mx-auto max-w-3xl space-y-6 px-4 py-12"><p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Rigwise tools</p><h1 className="text-4xl font-bold">Check CPU support before upgrading</h1><Compatibility records={data.records}/></main>;}
