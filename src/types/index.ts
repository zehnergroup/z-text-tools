type ThemeConfig = {
  theme_id?: number;
  store?: string;
};

export type YMLConfig = {
  development: ThemeConfig;
  production: ThemeConfig;
};

export type Branch = {
  type: string;
  name?: string;
};

export type Ticket = {
  id: number;
  projectIdentifier: string;
};

export type Themes = {
  dev?: number;
  prod?: number;
};

export type PR = {
  title: string;
  url?: string;
  number?: number;
};

export type GithubConfig = {
  repo: string;
  owner: string;
  token?: string;
  baseBranch?: string;
};

export type ShopifyConfig = {
  hash?: string;
  editor?: string;
  base: {
    dev: string;
    prod: string;
  };
};

export type JiraConfig = {
  projectPrefix?: string;
  prefix?: string;
  base: string;
  email: string;
  token: string;
};

export type Config = {
  jira: JiraConfig;
  shopify: ShopifyConfig;
  author?: string;
  github: GithubConfig;
};

export type Feature = {
  title: string;
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
