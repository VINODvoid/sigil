pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("Eoxakhx7oq5oDsGLsjvNPUEw5E58yfWnNJ18weUtAbxh");

#[program]
pub mod credential {
    use super::*;

    pub fn issue_sigil(ctx: Context<IssueSigil>, params: IssueSigilParams) -> Result<()> {
        instructions::issue_sigil::handler(ctx, params)
    }

    pub fn revoke_sigil(ctx: Context<RevokeSigil>) -> Result<()> {
        instructions::revoke_sigil::handler(ctx)
    }

    pub fn update_sigil(ctx: Context<UpdateSigil>, params: UpdateSigilParams) -> Result<()> {
        instructions::update_sigil::handler(ctx, params)
    }

    pub fn record_spend(ctx: Context<RecordSpend>, amount: u64) -> Result<()> {
        instructions::record_spend::handler(ctx, amount)
    }
}
