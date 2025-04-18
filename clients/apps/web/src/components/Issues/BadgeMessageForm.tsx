import { schemas } from '@polar-sh/client'
import Button from '@polar-sh/ui/components/atoms/Button'
import LabeledRadioButton from '@polar-sh/ui/components/atoms/LabeledRadioButton'
import MoneyInput from '@polar-sh/ui/components/atoms/MoneyInput'
import TextArea from '@polar-sh/ui/components/atoms/TextArea'
import Markdown from 'markdown-to-jsx'
import { useTheme } from 'next-themes'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import IssueBadge from '../Embed/IssueBadge'

const BadgeMessageForm = (props: {
  value: string
  onUpdateMessage: (comment: string) => Promise<void> // when "update" is clicked
  onUpdateFundingGoal: (amount: schemas['CurrencyAmount']) => Promise<void> // when "update" is clicked
  showUpdateButton: boolean
  onChangeMessage: (comment: string) => void // real time updates
  onChangeFundingGoal: (amount: schemas['CurrencyAmount']) => void // real time updates
  innerClassNames: string
  showAmountRaised: boolean
  canSetFundingGoal: boolean
  upfrontSplit: number | null
  funding: schemas['Funding']
  orgName: string
  title?: string
  subtitle?: string
}) => {
  const [message, setMessage] = useState(props.value)

  const [descriptionMode, setDescirptionMode] = useState('View')

  useEffect(() => {
    setMessage(props.value)
  }, [props.value])

  const [canSave, setCanSave] = useState(false)

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    setCanSave(e.target.value !== props.value)
    props.onChangeMessage(e.target.value)
  }

  const [isLoading, setIsLoading] = useState(false)

  const [fundingGoal, setFundingGoal] = useState<number>(
    props.funding.funding_goal?.amount || 0,
  )

  const funding = {
    ...props.funding,
    funding_goal: {
      ...props.funding.funding_goal,
      amount: fundingGoal,
      currency: 'usd',
    },
  }

  const showAmountRaised =
    props.showAmountRaised &&
    funding.pledges_sum?.amount !== undefined &&
    funding.pledges_sum?.amount > 0

  const onClickUpdate = async () => {
    setIsLoading(true)
    await props.onUpdateMessage(message)
    await props.onUpdateFundingGoal(funding.funding_goal)
    setIsLoading(false)
  }

  const { resolvedTheme } = useTheme()

  const onFundingGoalChange = (amount: number) => {
    setFundingGoal(amount)
    setCanSave(amount !== props.funding?.funding_goal?.amount)
    if (props.onChangeFundingGoal) {
      props.onChangeFundingGoal({ currency: 'usd', amount })
    }
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="text-gray flex items-center justify-between">
        <div>
          <div className="text-sm font-medium dark:text-white">
            {props.title ?? 'Customize embed'}
          </div>
          {props.subtitle && (
            <div className="dark:text-polar-400 mt-2 text-sm text-gray-500">
              {props.subtitle}
            </div>
          )}
        </div>

        <LabeledRadioButton
          values={['View', 'Edit']}
          value={descriptionMode}
          onSelected={setDescirptionMode}
        />
      </div>
      <div
        className={twMerge(
          props.innerClassNames,
          'dark:bg-polar-900 dark:border-polar-700 rounded-2xl bg-gray-50 p-8 dark:border',
        )}
      >
        {descriptionMode === 'View' && (
          <>
            <div className="prose dark:prose-invert">
              <Markdown
                options={{
                  wrapper: React.Fragment,
                }}
              >
                {message}
              </Markdown>
            </div>

            <IssueBadge
              orgName={props.orgName}
              showAmountRaised={showAmountRaised}
              darkmode={resolvedTheme === 'dark'}
              funding={funding}
              avatarsUrls={[]}
              upfront_split_to_contributors={props.upfrontSplit}
              issueIsClosed={false}
              donationsEnabled={false}
            />
          </>
        )}
        {descriptionMode === 'Edit' && (
          <>
            <TextArea rows={6} value={message} onChange={onChange} />
          </>
        )}
      </div>
      <div className="flex flex-col justify-between">
        {/* <div className="text-gray-600">
          Template variables: <code>{'{badge}'}</code>, <code>{'{repo}'}</code>
        </div> */}

        {props.canSetFundingGoal && (
          <div className="flex max-w-[300px] flex-col space-y-2 py-4">
            <label
              htmlFor="fundingGoal"
              className="text-sm font-medium dark:text-white"
            >
              Set funding goal
            </label>
            <MoneyInput
              id={'fundingGoal'}
              name={'fundingGoal'}
              onChange={onFundingGoalChange}
              placeholder={20000}
              value={fundingGoal}
              className="dark:bg-polar-800 bg-gray-50"
            />
          </div>
        )}

        {props.showUpdateButton && (
          <div className="mt-4">
            <Button
              onClick={onClickUpdate}
              disabled={!canSave}
              fullWidth={false}
              loading={isLoading}
            >
              Update
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default BadgeMessageForm
