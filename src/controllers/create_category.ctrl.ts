import { Req, Res, validationConfig } from '../api_contracts/create_category.ctrl.contract'
import isError from '../utils/is_error.utils'
import categoryModel from '../models/categories.model.server'

/**
 * Create Category
 */
export default async function createCategoryCtrl (req: Req): Res {
    const { user } = req
    const payload = req.body
    const validateData = validationConfig(payload)
    if (isError(validateData) || !validateData.data) {
        return {
            success: false,
            message: validateData.error?.message || 'Invalid data',
            options: {
                status: 400
            }
        }
    }

    const categoryResult = await categoryModel.createAndSave({
        user: user._id,
        name: payload.name,
    })
    if (isError(categoryResult) || !categoryResult.data) {
        return {
            success: false,
            message: categoryResult.error?.message || 'Something went wrong',
            options: {
                status: 400
            }
        }
    }

    return {
        message: 'Created category successfully',
        success: true,
        data: categoryResult.data,
        options: {
            status: 201
        }
    }
}
