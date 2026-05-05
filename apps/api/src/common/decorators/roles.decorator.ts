import { SetMetadata } from '@nestjs/common'

export const ROLES_KEY = 'roles'

/**
 * Attach required roles to a route handler.
 * Usage: @Roles(UserRole.ADMIN)  or  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
 * Must be combined with RolesGuard.
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles)
