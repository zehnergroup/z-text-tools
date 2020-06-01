export type Branch = {
  type: string;
  name?: string;
};

export type Ticket = {
  id: string;
};

export type Themes = {
  dev: string;
  prod: string;
};

export type PR = {
  title: string;
};

export type ConfigGithub = {
  repo: string;
  owner: string;
  token?: string;
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
  prefix?: string;
  base: string;
};

export type ConfigURLs = {
  jira: JiraURLs;
  shopify: ShopifyURLs;
};

export type Config = {
  workingDirectory: string;
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
