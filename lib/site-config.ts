export const siteConfig = {
  name: "HallownestAPI",
  shortDescription:
    "An open, structured data API for Hollow Knight and Silksong. Free, fan-made, non-commercial.",
  githubUrl: "https://github.com/yassenshopov/HallownestAPI",
  /**
   * Tip jar for the maintainer. Surfaced in the footer and in the homepage
   * community CTA — the project is free and non-commercial, but hosting and
   * data curation still cost time and money.
   */
  buyMeACoffeeUrl: "https://buymeacoffee.com/yassenshopov",
  /**
   * Personal links for the project's primary maintainer. Distinct from the
   * project repo above — these point at the human, not the codebase. Kept on
   * `siteConfig` (rather than hard-coded) so swapping maintainers later is a
   * one-file change.
   */
  author: {
    name: "Yassen Shopov",
    githubUrl: "https://github.com/yassenshopov",
    linkedinUrl: "https://www.linkedin.com/in/yassenshopov",
  },
} as const;
