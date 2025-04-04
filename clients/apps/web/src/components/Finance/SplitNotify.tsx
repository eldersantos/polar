import { api } from '@/utils/client'
import { githubIssueLink } from '@/utils/github'
import { schemas } from '@polar-sh/client'
import Avatar from '@polar-sh/ui/components/atoms/Avatar'
import Button from '@polar-sh/ui/components/atoms/Button'
import TextArea from '@polar-sh/ui/components/atoms/TextArea'
import Banner from '@polar-sh/ui/components/molecules/Banner'
import { getCentsInDollarString } from '@polar-sh/ui/lib/money'
import { useState } from 'react'
import { ModalHeader } from '../Modal'

const prettyUsernames = (splits: schemas['ConfirmIssueSplit'][]): string => {
  const usernames = splits
    .map((s) => s.github_username)
    .filter((s): s is string => Boolean(s))
    .map((s) => `@${s}`)

  if (usernames.length == 1) {
    return usernames[0]
  }

  const last = usernames.pop()
  const concatUsernames = usernames.join(', ') + ' and ' + last

  return concatUsernames
}

const SplitNotify = (props: {
  issue: schemas['Issue']
  pledges: schemas['Pledge'][]
  splits: schemas['ConfirmIssueSplit'][]
  user: schemas['UserRead']
  onCancel: () => void
}) => {
  const totalPledgedAmount = props.pledges
    .map((p) => p.amount)
    .reduce((a, b) => a + b, 0)

  const concatUsernames = prettyUsernames(props.splits)

  const defaultMessage = `Thank you ${concatUsernames} for contributing to close this issue! ⭐

The rewards from this issue, totaling $${getCentsInDollarString(
    totalPledgedAmount,
    false,
    true,
  )}, has been shared with you.

**What now?**

1. Create a [Polar](https://polar.sh) account
2. See incoming rewards & setup Stripe to receive them
3. Get payouts as backers finalize their payments

_If you already have a Polar account setup, you don't need to do anything._
`

  const [value, setValue] = useState(defaultMessage)

  const [isLoading, setIsLoading] = useState(false)

  const [isPosted, setIsPosted] = useState(false)

  const onConfirm = async () => {
    setIsLoading(true)
    await api.POST('/v1/issues/{id}/comment', {
      params: { path: { id: props.issue.id } },
      body: { message: value, append_badge: false },
    })
    setIsLoading(false)
    setIsPosted(true)
  }

  const canSubmit = value.length > 0 && !isPosted

  return (
    <>
      <ModalHeader hide={props.onCancel}>
        <>Share the good news</>
      </ModalHeader>
      <div className="space-y-4 pt-4">
        <div className="flex flex-col gap-4 px-4">
          <TextArea
            resizable={false}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={14}
          />
          <div className="flex flex-row items-center gap-4">
            <Avatar
              avatar_url={props.user.avatar_url}
              name={props.user.email}
            />
            <span className="dark:text-polar-200 text-gray-500">
              Comment will be posted on your behalf to issue{' '}
              <a href={githubIssueLink(props.issue)} className="font-medium">
                #{props.issue.number}
              </a>
            </span>
          </div>
          {isPosted && (
            <Banner color="blue">Great! Your message has been posted.</Banner>
          )}
        </div>
        <div className="dark:bg-polar-800 dark:text-polar-400 flex items-center bg-gray-100 px-4 py-2 text-gray-500">
          <div className="flex-1"></div>
          <div>
            <Button variant="ghost" className="mr-4" onClick={props.onCancel}>
              Cancel
            </Button>
          </div>
          <div>
            <Button
              disabled={!canSubmit}
              onClick={onConfirm}
              loading={isLoading}
            >
              <span>Post comment</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default SplitNotify
