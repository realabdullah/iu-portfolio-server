import { Req, Res } from '../api_contracts/create_password.ctrl.contract'
import isError from '../utils/is_error.utils'
import passwordModel from '../models/passwords.models.server'
import { decryptString } from '../utils/encryption.util'
import envs from '../envs'

/**
 * Create password
 */
export default async function createPasswordCtrl (req: Req): Res {
    const { user } = req
    const payload = req.body
    // validate request
    const passwordResult = await passwordModel.createAndSave({
        user: user._id,
        url: payload.url,
        username: payload.username,
        password: payload.password
    })
    if (isError(passwordResult) || !passwordResult.data) {
        return {
            success: false,
            message: passwordResult.error?.message || 'Something went wrong',
            options: {
                status: 400
            }
        }
    }

    const decryptPassword = decryptString(passwordResult.data.password, envs.secrets.encryption)
    if (isError(decryptPassword) || !decryptPassword.data) {
        return {
            success: false,
            message: decryptPassword.error?.message || 'Something went wrong',
            options: {
                status: 400
            }
        }
    }

    passwordResult.data.password = decryptPassword.data.decryptedData

    return {
        message: 'Created password successfully',
        success: true,
        data: passwordResult.data,
        options: {
            status: 201
        }
    }
}