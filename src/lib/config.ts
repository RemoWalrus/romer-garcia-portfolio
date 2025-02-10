
import { parse } from 'yaml';
import sections from '../config/sections.yml';

export const siteConfig = parse(sections);

export type SiteConfig = typeof siteConfig;
