/**
 * The LevainJson interface for the levain.json file.
 * This file is used to configure a project running Levain.
 */
export interface LevainJson {
  /**
   * The organization id for this project.
   */
  orgId?: string;

  networks?: OrganizationNetwork[];
}

export interface OrganizationNetwork {
  /**
   * The organization network id.
   */
  organizationNetworkId: string;

  /**
   * The network id formatted as caip2.
   */
  caip2Identifier: string;
}
