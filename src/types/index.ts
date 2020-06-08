type ThemeConfig = {
  theme_id?: number;
  store?: string;
};

export type ConfigYML = {
  development: ThemeConfig;
  production: ThemeConfig;
};

export type Branch = {
  type: string;
  name?: string;
};

export type Ticket = {
  id: string;
};

export type Themes = {
  dev?: number;
  prod?: number;
};

export type PR = {
  title: string;
};

export type ConfigGithub = {
  repo: string;
  owner: string;
  token?: string;
  baseBranch?: string;
};

export type ShopifyURLs = {
  hash?: string;
  editor?: string;
  base: {
    dev: string;
    prod: string;
  };
};

export type JiraURLs = {
  projectPrefix?: string;
  prefix?: string;
  base: string;
};

export type ConfigURLs = {
  jira: JiraURLs;
  shopify: ShopifyURLs;
};

export type Config = {
  urls: ConfigURLs;
  author?: string;
  github: ConfigGithub;
};

export type Feature = {
  ticket: Ticket;
  themes: Themes;
  branch: Branch;
  pr: PR;
};

export interface Database {
  config: Config;
  currentFeature: number | null;
  features: Feature[];
}
