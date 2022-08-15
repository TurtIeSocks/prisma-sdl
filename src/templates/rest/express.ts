import type { Extension } from '../../assets/types'

export function restExpress(ext: Extension): string {
  return {
    'd.ts': `declare const router: import("express-serve-static-core").Router;
export default router;
    `,
    js: `"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
{{es5_module}}
const express_1 = __importDefault(require("express"));
const context_1 = require("../../context");
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    try {
        const hasSelect = Object.values(req.query).some((v) => v === '');
        const hasWhere = Object.values(req.query).some((v) => v && typeof v === 'string');
        const query = Object.keys(req.query).length
            ? context_1.context.{{schema_camel}}Client.{{model_camel}}.findMany({
                select: hasSelect
                    ? {
                      {{model_rest_select}}
                    }
                    : undefined,
                where: hasWhere
                    ? {
                      {{model_rest_where}}
                    }
                    : undefined,
            })
            : context_1.context.{{schema_camel}}Client.{{model_camel}}.findMany();
        res.status(200).json(await query);
        console.log('[API] api/v1/{{model_camelPlural}}, params:', req.query);
    }
    catch (e) {
        if (e instanceof Error) {
            console.error('[API Error] api/v1/{{model_camelPlural}}, params:', req.query, e.message);
            res
                .status(500)
                .json({ status: 'error', reason: e.message, params: req.query });
        }
    }
});
exports.default = router;
`,
    ts: `/* eslint-disable no-console */
import express from 'express'
import { context } from '../../context'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const hasSelect = Object.values(req.query).some((v) => v === '')
    const hasWhere = Object.values(req.query).some(
      (v) => v && typeof v === 'string',
    )
    const query = Object.keys(req.query).length
      ? context.{{schema_camel}}Client.{{model_camel}}.findMany({
          select: hasSelect
            ? {
                {{model_rest_select}}
              }
            : undefined,
          where: hasWhere
            ? {
                {{model_rest_where}}
              }
            : undefined,
        })
      : context.{{schema_camel}}Client.{{model_camel}}.findMany()
    res.status(200).json(await query)
    console.log('[API] api/v1/{{model_camelPlural}}, params:', req.query)
  } catch (e) {
    if (e instanceof Error) {
      console.error(
        '[API Error] api/v1/{{model_camelPlural}}, params:',
        req.query,
        e.message,
      )
      res
        .status(500)
        .json({ status: 'error', reason: e.message, params: req.query })
    }
  }
})

export default router
`,
  }[ext]
}
